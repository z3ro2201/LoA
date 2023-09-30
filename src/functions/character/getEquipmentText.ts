import axios from 'axios'
import global from '../../config/config'

async function getEquipmentText(characterName: string) {
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
        let qualityValue: number = 0;
        for(let tmp of equipment) {
            if(i > 5) break;
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const quality = JSON.parse(toolTips).Element_001.value.qualityValue;
            const cleanedToolTipString = tmp.Tooltip;
            const tooltipObject = JSON.parse(cleanedToolTipString);
            let toolTipText = '';
            for(const tmpData in tooltipObject) {
                if(tooltipObject.hasOwnProperty(tmpData)) {
                    const element = tooltipObject[tmpData];
                    if (element && element.value && element.type && element.type.indexOf('IndentStringGroup') !== -1) {
                        const indentContentStr = element.value.Element_000.contentStr;
                        const indentTopStr = element.value.Element_000.topStr;
                        if (indentTopStr) {
                            const title = indentTopStr.toUpperCase().split('<BR>');
                            toolTipText += `\n${title.join(': ').replace(global.regex.htmlEntity, '')}`
                        }
                        /*if (indentContentStr) {
                            Object.keys(indentContentStr).forEach(keyName => {
                                const key = indentContentStr[keyName];
                                if (key && key.contentStr) {
                                    const toolTipSplit = key.contentStr.toUpperCase().replace(/(<BR>|\\)/g, '<BR>').split('<BR>');
                                    toolTipText += `\n${toolTipSplit.join('\n').replace(global.regex.htmlEntity, '')}`
                                }
                            });
                        }*/
                    }
                }
            }
            engravingArr.push(`${tmp.Grade}  ${tmp.Type}    ${tmp.Name} (품질: ${quality})${toolTipText}`);
            qualityValue += parseInt(quality);
            i++;
        }

        const characterData = `[${profile.ServerName}] ${profile.CharacterName}\n\n${engravingArr.join('\n\n')}\n아이템레벨: ${profile.ItemMaxLevel}\n평균품질: ${qualityValue/6}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getEquipmentText;