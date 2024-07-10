import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

interface subCharacterList {
    combatLevel: number,
    itemLevel: number
}

async function getAllServerSubCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}characters/${characterName}/siblings`;
    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        if(suspendAccountCheck.code === 204) {
            try {
                    const response = await axios.get(apiUrl, {
                        headers: global.token.lostarkHeader
                    });
            
                    const data = response.data;
            
                    // 서버 이름 별로 데이터를 구분하기 위한 객체
                    const characterListObj = {};
            
                    // 데이터 처리
                    for (const tmp of data) {
                        // 서버 이름 별로 배열을 초기화하지 않은 경우 초기화 실행
                        if (!characterListObj[tmp.ServerName]) {
                            characterListObj[tmp.ServerName] = [];
                        }
            
                        // 서버 이름 별로 데이터 추가
                        characterListObj[tmp.ServerName].push({
                            combatLevel: tmp.CharacterLevel,
                            itemLevel: parseFloat(tmp.ItemAvgLevel.replace(',', '')),
                            textStr: `${tmp.CharacterLevel.toString().padStart(2, '0')} ${tmp.CharacterClassName} ${tmp.CharacterName} (${tmp.ItemAvgLevel})`
                        });
                    }
            
                    const subCharacterList = [];
                    // 각 서버 별 데이터 정렬
                    for (const server in characterListObj) {
                        characterListObj[server].sort((a, b) => b.itemLevel - a.itemLevel);
            
                        // combatLevel, itemLevel 삭제 후 textStr만 남기기
                        characterListObj[server] = characterListObj[server].map(({ textStr }) => ({ textStr }));
            
                        // 정렬된 배열을 기반으로 문자열 생성
                        const characterDataArr = characterListObj[server].map(character => character.textStr);
                        subCharacterList.push(`[${server}]\n ${characterDataArr.join('\n ')}`)
                    }

                    // 최종 데이터 반환
                    return subCharacterList.join('\n\n');
                } catch (error) {
                    throw error; // 오류를 호출자로 던짐
                }
        } else if (suspendAccountCheck.code === 200) {
            return '해당 계정은 정지된 계정입니다.';
        } else {
            return '해당 계정은 없는 계정입니다.';
        }
    }
}

export default getAllServerSubCharacterInfoText;