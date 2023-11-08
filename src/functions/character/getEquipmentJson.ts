import axios from 'axios'
import global from '../../config/config'

interface EquipmentInfo {
    Name: string;
    Server: number;
    ItemAvgLevel: string;
    ItemMaxLevel: string;
    Equipment: object;
}

async function getCharacterEquipmentJson(characterName: string): Promise<EquipmentInfo> {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bequipment`;

    try {
        const characterApi = `${global.apiUrl.lostark}characters/${characterName}/siblings`;
        const characterInfo = await axios.get(characterApi, {
            headers: global.token.lostarkHeader
        })
        .then(res => {
            const response = res.data;
            return response.find(characterData => characterData.CharacterName.includes(characterName));
        })
        .catch(e => {
            return '생성되지 않았거나 삭제된 캐릭터 입니다.';
        });


        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const data = response.data;
        const profile = data.ArmoryProfile;
        const equipment = data.ArmoryEquipment;

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const equipmentArr = [];
        let i: number = 0;
        let qualityValue: number = 0;
        for(let tmp of equipment) {
            if(i > 5) break;
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const tmpData = {
                Type: tmp.Type,
                Grade: tmp.Grade,
                Name: tmp.Name,
                Tooltip: JSON.parse(toolTips)
            };
            equipmentArr.push(tmpData);
            i++;
        }

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterData: EquipmentInfo = {
            Name: characterInfo.CharacterName,
            Server: characterInfo.ServerName,
            ItemAvgLevel: profile.ItemAvgLevel,
            ItemMaxLevel: profile.ItemMaxLevel,
            Equipment: equipmentArr
        };
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterEquipmentJson;