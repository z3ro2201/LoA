import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

async function getAccessoryText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bequipment`;

    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
        if(suspendAccountCheck === 204) {
            const updateData = await getCharacterData(characterName);
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });

                const data = response.data;
                const profile = data.ArmoryProfile;
                const equipment = data.ArmoryEquipment;
                let qualityValue = 0;

                // 서버 응답을 파싱하여 캐릭터 정보를 추출
                const engravingArr = [];
                let i: number = 0;
                for(let tmp of equipment) {
                    if(i > 5 && i < 13) {
                        const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
                        const quality = (i < 11) ? JSON.parse(toolTips).Element_001.value.qualityValue : 0;
                        const qualityText = (i < 11) ? `품질 ${quality}` : '';
                        const cleanedToolTipString = tmp.Tooltip;
                        const tooltipObject = JSON.parse(cleanedToolTipString);
                        if(i < 11) {
                            qualityValue += JSON.parse(toolTips).Element_001.value.qualityValue;
                        }
                        let toolTipText = '';
                        let gakin = [];
                        for(const tmpData in tooltipObject) {
                            if(tooltipObject.hasOwnProperty(tmpData)) {
                                const element = tooltipObject[tmpData];
                                if(i == 12 && element && element.value && element.type && element.type.indexOf('ItemPartBox') !== -1) {
                                    let toolTip_bracelet = element.value.Element_001.split('<BR>');
                                    toolTip_bracelet.sort((a, b) => {
                                        if (a.includes('+') && !b.includes('+')) {
                                          return -1;
                                        } else if (!a.includes('+') && b.includes('+')) {
                                          return 1;
                                        } else {
                                          return 0;
                                        }
                                      });
                                      
                                    toolTipText = `${toolTip_bracelet.join('\n').replace(global.regex.htmlEntity,'').replace(/^\s+/, '').replace(/(\()/g, '\n$1')}`;
                                }
                                else if(i !== 12 && element && element.value && element.type && element.type.indexOf('ItemPartBox') !== -1) {
                                    toolTipText = (qualityText !== '') ? `${qualityText}, ${element.value.Element_001.split('<BR>').join(', ')}` : element.value.Element_001.split('<BR>').join(', ');
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
                        engravingArr.push(`${(i > 10) ? '\n★' : '❙'} ${tmp.Grade}  ${tmp.Type}\n${toolTipText}${gakinMsg}`);
                    }
                    i++;
                }

                const characterData = `❙ 아이템레벨: ${profile.ItemMaxLevel} (평균품질: ${qualityValue/5})\n\n${engravingArr.join('\n')}`;
                return characterData;
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

export default getAccessoryText;