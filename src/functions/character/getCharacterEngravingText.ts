import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

async function getCharacterEngravingText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bequipment%2Bengravings`;

    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
        if(suspendAccountCheck === 204) {
            const updateData = await getCharacterData(characterName);
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });
0
                const data = response.data;
                const profile = data.ArmoryProfile;
                const equipment = data.ArmoryEquipment;
                const engravings = data.ArmoryEngraving;

                // 서버 응답을 파싱하여 캐릭터 정보를 추출
                const engravingArr = [];
                let i: number = 0;
                const engravingData = {
                    engName1: null,
                    engCount1: 0,
                    engName2: null,
                    engCount2: 0,
                    engName3: null,
                    engCount3: 0,
                    engName4: null,
                    engCount4: 0,
                    engName5: null,
                    engCount5: 0,
                    engName6: null,
                    engCount6: 0,
                    engName7: null,
                    engCount7: 0,
                    engName8: null,
                    engCount8: 0,
                    engName9: null,
                    engCount9: 0,
                    engName10: null,
                    engCount10: 0
                };

                for(let tmp of equipment) {
                    if(i > 5 && i < 12) {
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
                                                const toolTipSplit = key.contentStr.replace(/(<BR>|\\)/g, '<BR>').split('<BR>').join('').replace(global.regex.htmlEntity, '');
                                                const engName = toolTipSplit.replace(/\[([^\]]*)\]\s*([^+]*)\s*\+(\d+)/, (match, group1, group2, group3) => `${group1}`);
                                                const engCount = Number(toolTipSplit.replace(/\[([^\]]*)\]\s*([^+]*)\s*\+(\d+)/, (match, group1, group2, group3) => `${group3}`));

                                                let found = false;
                                                // 활성각인이 있는지 여부 확인
                                                if(engName.includes('감소')) {
                                                    for (let k = 7; k <= 10; k++) {
                                                        const propName = `engName${k}`;
                                                        const countPropName = `engCount${k}`;
                                                        // 검색된 이름이 있는 경우
                                                        if(engravingData[propName] === engName) {
                                                            engravingData[countPropName] += engCount;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                } else {
                                                    for (let k = 1; k <= 6; k++) {
                                                        const propName = `engName${k}`;
                                                        const countPropName = `engCount${k}`;
                                                        // 검색된 이름이 있는 경우
                                                        if(engravingData[propName] === engName) {
                                                            engravingData[countPropName] += engCount;
                                                            found = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                // 아이템 각인 활성도를 확인하지 못한경우
                                                if(!found) {
                                                    if(engName.includes('감소')) {
                                                        for (let k = 7; k <= 10; k++) {
                                                            const propName = `engName${k}`;
                                                            const countPropName = `engCount${k}`;
                                                            // 검색된 이름이 있는 경우
                                                            if(engravingData[propName] === null) {
                                                                engravingData[propName] = engName;
                                                                engravingData[countPropName] += engCount;
                                                                break;
                                                            }
                                                        }
                                                    } else {
                                                        for (let k = 1; k <= 6; k++) {
                                                            const propName = `engName${k}`;
                                                            const countPropName = `engCount${k}`;
                                                            // 검색된 이름이 있는 경우
                                                            if(engravingData[propName] === null) {
                                                                engravingData[propName] = engName;
                                                                engravingData[countPropName] += engCount;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                //gakin.push(`${toolTipSplit.join('').replace(/\\n/g, '').replace(global.regex.htmlEntity, '').replace(/\[([^\]]*)\]\s*([^+]*)\s*\+(\d+)/, (match, group1, group2, group3) => `${group1} ${group3}`)}`)
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
//◆◇
                const allowEng = engravings.Engravings;
                
                if(allowEng !== null && allowEng.length > 0) {
                    for(const tmpEng of allowEng) {
                        const engName = tmpEng.Name;
                        const tooltipText = tmpEng.Tooltip.replace(global.regex.htmlEntity, '');
                        const tooltipObject = JSON.parse(tooltipText);
                        let engCount = 0;
                        let found = false;
                        for(const tmpData in tooltipObject) {
                            if(tooltipObject.hasOwnProperty(tmpData)) {
                                const element = tooltipObject[tmpData];
                                if(element && element.value && element.type && element.type.indexOf('EngraveSkillTitle') !== -1) {
                                    engCount = Number(element.value.leftText.replace(global.regex.htmlEntity, '').match(/\d+/)[0]);
                                }
                            }
                        }
                        
                        for (let k = 1; k <= 6; k++) {
                            const propName = `engName${k}`;
                            const countPropName = `engCount${k}`;
                            // 검색된 이름이 있는 경우
                            if(engravingData[propName] === engName) {
                                engravingData[countPropName] += engCount;
                                found = true;
                                break;
                            }
                        }
                        
                        if(!found) {
                            for (let k = 1; k <= 6; k++) {
                                const propName = `engName${k}`;
                                const countPropName = `engCount${k}`;
                                // 검색된 이름이 있는 경우
                                if(engravingData[propName] === null) {
                                    engravingData[propName] = engName;
                                    engravingData[countPropName] += engCount;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if(engravingData.engName1 === null) {
                    return '장착 또는 활성화된 각인효과가 없습니다.';
                } else {
                    let engravingEffect = '';
                    for(let k = 1; k <= 10; k++) {
                        const propName = `engName${k}`;
                        const propCount = `engCount${k}`;
                        if(engravingData[propName] !== null) {
                            let allow = '';
                            let notAllow = '';
                            const allowCnt = Number(engravingData[propCount]);
                            const notAllowCnt = Number(15 - engravingData[propCount]);
                            for(let a = 1; a <= allowCnt; a++) {
                                allow += '◆';
                            }

                            for (let na = 1; na <= notAllowCnt; na++) {
                                notAllow += '◇';
                            }
                            const allowHop = `${allow}${notAllow}`;
                            const tmpEngEffectText = `${engravingData[propName]} ${'+' + engravingData[propCount]}\n[${allowHop.match(/.{1,5}/g).join('|')}]`;
                            engravingEffect += (k < 10) ? `${tmpEngEffectText}\n` : `${tmpEngEffectText}`;
                        }
                    }
                    return `${characterName}의 각인 활성도 정보\n${engravingEffect}`;
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

export default getCharacterEngravingText;