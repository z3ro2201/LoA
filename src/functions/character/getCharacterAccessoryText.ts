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
            if(i > 5 && i < 13) {
                const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
                const quality = (i < 11) ? JSON.parse(toolTips).Element_001.value.qualityValue : 0;
                const qualityText = (i < 11) ? `: ${quality}` : '';
                const cleanedToolTipString = tmp.Tooltip;
                const tooltipObject = JSON.parse(cleanedToolTipString);
                let toolTipText = '';
                let gakin = [];
                for(const tmpData in tooltipObject) {
                    if(tooltipObject.hasOwnProperty(tmpData)) {
                        const element = tooltipObject[tmpData];
                        if(i == 12 && element && element.value && element.type && element.type.indexOf('ItemPartBox') !== -1) {
                            const toolTip_bracelet = element.value.Element_001.split('<BR>');
                            toolTipText = `\n${toolTip_bracelet.join('\n').replace(global.regex.htmlEntity,'')}`;
                        }
                        if (element && element.value && element.type && element.type.indexOf('IndentStringGroup') !== -1) {
                            const indentContentStr = element.value.Element_000.contentStr; // Element_006의 contentStr
                            if (indentContentStr) {
                                Object.keys(indentContentStr).forEach(keyName => {
                                    const key = indentContentStr[keyName];
                                    if (key && key.contentStr) {
                                        const toolTipSplit = key.contentStr.replace(/(<BR>|\\)/g, '<BR>').split('<BR>');
                                        gakin.push(`${toolTipSplit.join('').replace(/\\n/g, '').replace(global.regex.htmlEntity, '').replace(/\[([^\]]*)\]\s*([^+]*)\s*\+(\d+)/, (match, group1, group2, group3) => `${group1.split(' ').join('')}+${group3}`)}`)
                                    }
                                });
                            }
                        }
                    }
                }
                const gakinMsg = (gakin.length > 0) ? '\n' + gakin.join(', ') : '';
                const lastIndex = tmp.Name.lastIndexOf(' ');
                const visiblePart = tmp.Name.substring(0, lastIndex + 1); // 마지막 공백까지의 부분 추출
                engravingArr.push(`${tmp.Grade}  ${tmp.Type}    ${visiblePart.replace('의', '')} ${qualityText}${toolTipText}${gakinMsg}\n`);
            }
            i++;
        }

        const characterData = `${engravingArr.join('\n')}\n아이템레벨: ${profile.ItemMaxLevel}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getAccessoryText;