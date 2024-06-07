import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

interface subCharacterList {
    combatLevel: number,
    itemLevel: number
}

async function getSubCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}characters/${characterName}/siblings`;
    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    if(suspendAccountCheck === 204) {

        try {
            const response = await axios.get(apiUrl, {
                headers: global.token.lostarkHeader
            });

            const data = response.data;

            // 캐릭터목록
            const characterServer = data.filter(characterData => characterData.CharacterName === characterName);
            const characterListArr = [];
            for(const tmp of data) {
                if(characterServer[0].ServerName === tmp.ServerName) {
                    //const updateData = await getCharacterData(tmp.CharacterName);
                    characterListArr.push({combatLevel: tmp.CharacterLevel, itemLevel: parseFloat(tmp.ItemAvgLevel.replace(',', '')), textStr: `${tmp.CharacterLevel.toString().padStart(2, '0')} ${tmp.CharacterClassName}  ${tmp.CharacterName}  (${tmp.ItemAvgLevel})`})
                }
            }

            // 레벨 순 정렬
            characterListArr.sort((a:subCharacterList, b:subCharacterList) => {
                return b.itemLevel - a.itemLevel;
            })

            // combatLevel, itemLevel 삭제 후 textStr만 남기기
            const sortedCharacterListArr = characterListArr.map(({textStr}) => ({textStr}));

            // 정렬된 배열을 기반으로 문자열 생성 및 추가
            const characterDataArr = sortedCharacterListArr.map(character => character.textStr);
            const characterData = `[${characterServer[0].ServerName} 서버]\n${characterDataArr.join('\n')}\n\n총 ${characterDataArr.length}개의 캐릭터 보유`;
            return characterData;
        } catch (error) {
            throw error; // 오류를 호출자로 던짐
        }
    } else if (suspendAccountCheck === 200) {
        return '해당 계정은 정지된 계정입니다.';
    } else {
        return '해당 계정은 없는 계정입니다.';
    }
}

export default getSubCharacterInfoText;