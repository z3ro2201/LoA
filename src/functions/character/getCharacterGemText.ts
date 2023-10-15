import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';

interface gems {
    level: number
}

async function getCharacterGemText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bgems`;

    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        if(suspendAccountCheck === 204) {
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });

                const profile = response.data.ArmoryProfile;
                const gems = response.data.ArmoryGem;

                // 보석정보
                const gemsTmpArr = [];
                let i:number = 0;
                for(const tmp of gems.Gems) {
                    const skillsName = gems.Effects.filter((item) => tmp.Slot === item.GemSlot)[0];
                    const arrName = `${tmp.Name.replace(global.regex.htmlEntity, '').replace(/(\d+)레벨 (.+)의 보석/, '$2')}`;
                    const tmpData = `${tmp.Name.replace(global.regex.htmlEntity, '').replace(/(\d+)레벨 (.+)의 보석/, '$1 $2')} ${skillsName.Name}`;
                    gemsTmpArr.push({level: tmp.Level, gemsName: arrName, data: tmpData});
                    i++;
                }

                const gemsArr = [];

                // 레벨 순 정렬
                gemsTmpArr.sort((a:gems, b:gems) => {
                    return b.level - a.level;
                })

                gemsTmpArr.forEach(item => {
                    const key = item.gemsName;
                    if(!gemsArr[key]) gemsArr[key] = [];
                    gemsArr[key].push(item.data);
                })

                // 서버 응답을 파싱하여 캐릭터 정보를 추출
                const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;     
                let characterData = '';
                for(const key in gemsArr) {
                    characterData += `[${key}]\n`;
                    gemsArr[key].forEach(data => characterData += `${data}\n`);
                    characterData += '\n';
                }
                return characterData;
            } catch (error) {
                throw error; // 오류를 호출자로 던짐
            }
        } else if (suspendAccountCheck === 200) {
            return '해당 계정은 정지된 계정입니다.';
        } else {
            return '해당 계정은 없는 계정입니다.';
        }
    } else {
        return '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간)';
    }
}

export default getCharacterGemText;