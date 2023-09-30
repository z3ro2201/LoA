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
        const elixirDataArr = [];
        const elixirTotalArr = [];
        let i: number = 0;
        let qualityValue: number = 0;
        for(let tmp of equipment) {
            if(i > 5) break;
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const quality = JSON.parse(toolTips).Element_001.value.qualityValue;
            const cleanedToolTipString = tmp.Tooltip;
            const tooltipObject = JSON.parse(cleanedToolTipString);
            for(const tmpData in tooltipObject) {
                const tmpElementElixir = [];
                if(tooltipObject.hasOwnProperty(tmpData)) {
                    const element = tooltipObject[tmpData];
                    if (element && element.value && element.type && element.type.indexOf('IndentStringGroup') !== -1) {
                        const indentContentStr = element.value.Element_000.contentStr;
                        if (indentContentStr) {
                            Object.keys(indentContentStr).forEach(keyName => {
                                const key = indentContentStr[keyName].contentStr;
                                const topStr = element.value.Element_000.topStr;
                                if(topStr.includes('엘릭서 효과')) {
                                    if(!key.includes('재사용 대기시간') && !key.includes('레벨 합'))
                                        tmpElementElixir.push(key.toUpperCase().split('<BR>')[0].replace(global.regex.htmlEntity, ''));
                                } else {
                                    if(key.includes('레벨 합')) {
                                        elixirTotalArr.push(key.toUpperCase().split('<BR>')[0].replace(global.regex.htmlEntity, '').replace(/\d단계 : /, ''));
                                    }
                                }
                            });
                        }
                    }
                    if(tmpElementElixir.length > 0) elixirDataArr.push(`${tmp.Type} ${tmpElementElixir.join(' ')}`);
                }
            }
            engravingArr.push(`${tmp.Grade} ${tmp.Type} ${tmp.Name.replace('+', ' ')} : ${quality}`);
            qualityValue += parseInt(quality);
            i++;
        }
        if(elixirTotalArr.length > 0) elixirDataArr.push(elixirTotalArr[elixirTotalArr.length - 1]);
        const elixirMessage = (elixirDataArr.length > 0) ? `\n&nbsp;\n[엘릭서 확인은 전체보기]\n${elixirDataArr.join('\n')}` : '';
        const characterData = `${engravingArr.join('\n')}\n\n아이템레벨: ${profile.ItemMaxLevel}\n평균품질: ${qualityValue/6}${elixirMessage}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getEquipmentText;