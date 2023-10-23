import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

export const command: Record<string, string>= {
    command: global.prefix + '캐릭카드',
    help: '[캐릭터이름]',
    description: '현재 장착된 카드와 세트효과를 볼 수 있습니다.'
}

async function getCharacterCardText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcards`;

    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
        if(suspendAccountCheck === 204) {
            const updateData = await getCharacterData(characterName);
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });

                if(response.data !== null) {
                    const profile = response.data.ArmoryProfile;
                    const card = response.data.ArmoryCard;

                    // 착용중인 카드정보
                    const cardsArr = [];
                    for(const tmp of card.Cards) {
                        cardsArr.push(`[${tmp.Grade}] ${tmp.Name} (각성 ${tmp.AwakeCount}/${tmp.AwakeTotal})`);
                    }

                    // 활성화된 세트효과
                    const cardEffectArr = [];
                    for(const tmp of card.Effects[0].Items) {
                        cardEffectArr.push(`${tmp.Name}  ${tmp.Description}`);
                    }

                    // 서버 응답을 파싱하여 캐릭터 정보를 추출
                    const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;
                    const cardList = (cardsArr.length > 0) ? `${cardsArr.join('\n')}` : '장착중인 카드가 없습니다.';
                    const cardEffect = (cardEffectArr.length > 0) ? `\n[세트효과]\n${cardEffectArr.join('\n')}` : '발동 된 세트효과가 없습니다.';
                    const characterData = `[${profile.CharacterClassName}]\n${characterTitle} ${profile.CharacterName}\n\n[카드목록]\n${cardList}\n\n${cardEffect}`;
                    return characterData;
                } else {
                    return '존재하지 않는 계정입니다.';
                }
            } catch (error) {
                throw error; // 오류를 호출자로 던짐
            }
        } else if (suspendAccountCheck === 200) {
            return '해당 계정은 정지된 계정입니다.';
        } else {
            return '해당 계정은 없는 계정입니다.';
        }
    }  else {
        return '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간)';
    }
}

export default getCharacterCardText;