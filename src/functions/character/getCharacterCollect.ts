import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

async function getCharacterCollectText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcollectibles`;

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
                    const collects = response.data.Collectibles;

                    // 착용중인 카드정보
                    const collectsArr = [];
                    for(const tmp of collects) {
                        collectsArr.push(`${tmp.Type}: ${tmp.Point}`);
                    }

                    // 서버 응답을 파싱하여 캐릭터 정보를 추출
                    const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;
                    const characterData = `[${profile.CharacterClassName}]\n${characterTitle} ${profile.CharacterName}\n\n[내실목록]\n${collectsArr.join(', ')}\n\n자세하게 보고 싶으시면 내실명령어에 옵션을 붙여보세요!`;
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

export default getCharacterCollectText;