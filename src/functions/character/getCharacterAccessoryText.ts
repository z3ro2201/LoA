import axios from 'axios'
import global from '../../config/config'

async function getAccessoryText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bequipment`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const data = response.data;
        const profile = data.ArmoryProfile;
        const equipment = data.ArmoryEquipment;

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const engravingArr = [];
        let i: number = 0;
        for(let tmp of equipment) {
            if(i > 5 && i < 12) {
                const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
                const quality = (i < 11) ? JSON.parse(toolTips).Element_001.value.qualityValue : 0;
                const qualityText = (i < 11) ? `(품질: ${quality})` : '';
                const cleanedToolTipString = tmp.Tooltip.replace(/<[^>]+>/g, '').replace(/\\n/g, '');
                const tooltipObject = JSON.parse(cleanedToolTipString);
                let toolTipText = '';
                for(const tmpData in tooltipObject) {
                    if(tooltipObject.hasOwnProperty(tmpData)) {
                        const element = tooltipObject[tmpData];
                        if(element && element.value && element.type && element.type.indexOf('ItemPartBox') !== -1) {
                            toolTipText = `\n[추가효과] ${element.value.Element_001}`;
                        }
                        if(element && element.value && element.type && element.type.indexOf('IndentStringGroup') !== -1) {
                            toolTipText = `\n${element.value.Element_000.contentStr.Element_000.contentStr.replace(global.regex.htmlEntity, '')}`;
                        }
                    }
                }
                engravingArr.push(`${tmp.Grade}  ${tmp.Type}    ${tmp.Name} ${qualityText}${toolTipText}\n`);
            }
            i++;
        }

        const characterData = `[${profile.ServerName}] ${profile.CharacterName}\n\n
        ${engravingArr.join('\n')}\n
        아이템레벨: ${profile.ItemMaxLevel}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getAccessoryText;