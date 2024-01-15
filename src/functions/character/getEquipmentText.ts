import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

async function getEquipmentText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bequipment`;
    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        try {
            const response = await axios.get(apiUrl, {
                headers: global.token.lostarkHeader
            });
            const data = response.data;
            
            const profile = data.ArmoryProfile;
            const equipment = data.ArmoryEquipment;
            let equipmentSet = null;
            let tmpExtraEffect = null;

            if (data?.ArmoryProfile) {
                // 서버 응답을 파싱하여 캐릭터 정보를 추출
                const engravingArr = [];
                const elixirDataArr = [];
                // const elixirTotalArr = [];
                let equipmentGrade = '';
                let i: number = 0;
                let qualityValue: number = 0;
                let elixirTot = 0;
                let equipmentSetLevel = 0;
                for(let tmp of equipment) {
                    if(i > 5) break;
                    const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
                    const quality = JSON.parse(toolTips).Element_001.value.qualityValue;
                    const cleanedToolTipString = tmp.Tooltip;
                    const tooltipObject = JSON.parse(cleanedToolTipString);
                    let equipmentName = '';
                    let ella = null;
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
                                            if(!key.includes('재사용 대기시간') && !key.includes('레벨 합')) {
                                                const tmpLv = key.toUpperCase().split('<BR>')[0].replace(global.regex.htmlEntity, '');
                                                const regex = /\d+/g;
                                                const numbers = tmpLv.match(regex).map(Number);
                                                elixirTot += parseInt(numbers[0]);
                                                tmpElementElixir.push(key.toUpperCase().split('<BR>')[0].replace(global.regex.htmlEntity, ''));
                                            }
                                        }
                                        else if (topStr.includes('연성 추가 효과')) {
                                            const tmp = topStr.toUpperCase().split('<BR>');
                                            tmpExtraEffect = tmp[1].replace(global.regex.htmlEntity, '');
                                        }
                                    });
                                }
                                if(element.value.Element_000.topStr.indexOf('초월') !== -1) {
                                    const tmp_grade = element.value.Element_000.topStr.replace(global.regex.htmlEntity, '');
                                    equipmentGrade = (tmp_grade !== null) ? ` ${tmp_grade}` : '';
                                }
                            }
                            
                            if (element && element.value && element.type && element.type.indexOf('SetItemGroup') !== -1) {
                                equipmentSet = element.value.firstMsg.replace(global.regex.htmlEntity, '').replace('Lv.', '');
                                equipmentName = `${element.value.firstMsg.replace(global.regex.htmlEntity, '')} (${element.value.itemData.Element_000.label.replace(global.regex.htmlEntity, '').replace(' ', '')}) `;
                                equipmentSetLevel++;
                            }

                            if(element && element.value && element.type && element.type.indexOf('IndentStringGroup') !== -1) {
                                console.log(element.value.Element_000.contentStr.Element_000.contentStr)
                                if(element.value && element.value.Element_000 && element.value.Element_000.contentStr && element.value.Element_000.contentStr.Element_000.contentStr.replace(global.regex.htmlEntity, '').includes("엘라 부여 완료")){
                                    ella = ' [엘라] ';
                                }
                                // if(element.value && element.value.Element_001 && element.value.Element_000.replace(global.regex.htmlEntity, '').includes("엘라 부여 완료")) {
                                //     
                                // }
                            }
                            if(tmpElementElixir.length > 0) elixirDataArr.push(`${tmp.Type} ${tmpElementElixir.join(' ')}`);
                        }
                    }

                    const equipmentSetName = tmp.Name.replace('+', ' ');
                    const lastIndex = equipmentSetName.lastIndexOf(' ');
                    const visiblePart = equipmentSetName.substring(0, lastIndex + 1); // 마지막 공백까지의 부분 추출
                    engravingArr.push(`${tmp.Grade}${ella!==null?ella:''} ${tmp.Type} +${visiblePart.replace(/[^0-9]/g, '')} ${equipmentName}: ${quality}${(equipmentGrade !== '') ? `\nㄴ${equipmentGrade}`:''}`);
                    qualityValue += parseInt(quality);
                    i++;
                }
                // 엘릭서 내용 병합
                let extraEffect = (tmpExtraEffect !== null) ? `${tmpExtraEffect !== null ? tmpExtraEffect : ''} (${elixirTot})` : null;

                // if(elixirTotalArr.length > 0) elixirDataArr.push(elixirTotalArr[elixirTotalArr.length - 1]);
                if(elixirTot > 0) elixirDataArr.push(`지혜의 엘릭서 레벨 합: ${elixirTot}`);
                const elixirMessage = (elixirDataArr.length > 0) ? `\n&nbsp;\n[엘릭서 확인은 전체보기]\n${elixirDataArr.join('\n')}` : '';
                const characterData = `❙ 아이템레벨: ${profile.ItemMaxLevel} (평균품질: ${(qualityValue/6).toFixed(3)})\n\n${engravingArr.join('\n')}\n${(equipmentSetLevel === 6) ? `\n❙ 세트효과: ${equipmentSet}\n`:'\n'}${extraEffect !== null ? `❙ 엘릭서: ${extraEffect}` : ''}\n${elixirMessage}`;
                return characterData;
            } else {
                return '없는 계정입니다.'
            }
        } catch (error) {
            throw error; // 오류를 호출자로 던짐
        }
    } else {
        return '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간)';
    }
}

export default getEquipmentText;