import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterCollectText from './getCharacterCollect';

export const command: Record<string, string>= {
    command: global.prefix + '캐릭터',
    help: '[캐릭터이름]',
    description: '캐릭터 정보를 볼 수 있습니다.'
}

async function getCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    
    if(suspendAccountCheck === 204) {
        // 데이터를 리턴할 변수
        let characterData = '';
        const apiStatus = await apiCheck();
        if(apiStatus === true) {
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

                if(response.data !== null) {
                    const profile = response.data.ArmoryProfile;
                    const engraving = response.data.ArmoryEngraving;
                    const card = response.data.ArmoryCard;
                    const equipment = response.data.ArmoryEquipment;
                    if(equipment === null) {
                        return '장비를 장착하지 않은 캐릭터는 정보를 가져올 수 없습니다.';
                    }
                    let elixirTot = 0;
                    let tmpExtraEffect = null;
                    let chowol = null;
                    let mokoko_sponsor = null;
                    let equipmentSet = null;

                    // 스탯정보
                    const statsArr = [];
                    let i:number = 0;
                    if(profile.Stats) {
                        for(var tmp of profile.Stats) {
                            if(i > 3) break;
                            else if(i === 2) {
                                i++;
                                continue;
                            }
                            const tmpData = `${tmp.Type.replace(/(.)./g, '$1')}: ${tmp.Value}`;
                            statsArr.push(tmpData);
                            i++;
                        }
                    }

                    // 장비정보
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
                                        const tmp_grade = element.value.Element_000.topStr.replace(global.regex.htmlEntity, '').match(/(\[초월\]) ([1-3]단계) ([0-9])/);
                                        chowol = (tmp_grade !== null) ? `초월 ${tmp_grade[2]}` : element.value.Element_000.topStr.replace(global.regex.htmlEntity, '');
                                    }
                                }
                                if (element && element.value && element.type && element.type.indexOf('ItemPartBox') !== -1) {
                                    if(element.value && element.value.Element_000 && element.value.Element_000.replace(global.regex.htmlEntity, '').includes("세트 효과 레벨")) {
                                        equipmentSet = element.value.Element_001.replace(global.regex.htmlEntity, '').replace('Lv.', '');
                                    }
                                }
                            }
                        }
                    }
                    // 엘릭서 내용 병합
                    let extraEffect = (tmpExtraEffect !== null) ? `${tmpExtraEffect !== null ? tmpExtraEffect : ''} (${elixirTot})` : null;

                    // 서버 응답을 파싱하여 캐릭터 정보를 추출
                    const characterTitle = (profile.Title === null) ? '' : `${profile.Title} `;
                    const guildName = (profile.GuildName === null) ? '미가입' : profile.GuildName;
                    let engravingText = '';
                    let statsText = (statsArr.length > 0) ? `[특성정보]\n${statsArr.join(', ')}` : '';
                        
                    const engravingEffect = [];
                    if(engraving && engraving.Effects) {
                        for(let tmp of engraving.Effects) {
                            engravingEffect.push(tmp.Name.replace(' Lv.', ''));
                        }
                        if(engravingEffect.length > 0) {
                            engravingText += `${engravingEffect.join(', ')}\n`;
                        }
                    }

                    // 활성화된 세트효과
                    const cardEffectArr = [];
                    if(card && card.Effects) {
                        for(const tmp of card.Effects[0].Items) {
                            cardEffectArr.push(`${tmp.Name}`);
                        }
                    }

                    // 데이터 삽입 및 데이터 업데이트
                    let engravingData = null;
                    let statsData = null;
                    let cardEffect = null;
                    const characterResult = await characterSearch(characterName)
                    .then(res => {
                        if(Array.isArray(res) && res.length === 0) {
                            engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                            statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                            cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                            characterInsert(characterInfo, profile, engravingData, statsData, cardEffect, extraEffect,equipmentSet);
                        } else {
                            const now: Date = new Date();
                            const updateTime: Date = new Date(res[0].updateTime);
                            const timeDifference = now.getTime() - updateTime.getTime();
                            const minutesDifference = timeDifference / (1000 * 60);

                            if(Array.isArray(res) && res.length > 0) {
                                mokoko_sponsor = res[0].mokoko_sponsor;
                            }
                            if (Array.isArray(res) && res.length > 0 && minutesDifference >= 1) { // 데이터는 존재하나 3분 이상이 지난경우
                                engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                                statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                                cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                                characterUpdate(characterInfo, profile, engravingData, statsData, cardEffect, extraEffect,equipmentSet);
                            }
                        }
                    })
                    
                    engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                    statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                    cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                    let collects = await getCharacterCollectText(characterName, 'returnData');

                    characterData = `${mokoko_sponsor === 1 ? '🌱 후원자 ':''}[${profile.CharacterClassName}]\n${(profile.Title !== '' && profile.Title !== null) ? profile.Title + ' ' : ''}${profile.CharacterName}\n\n` +
                                    `[캐릭터 기본정보]\n` +
                                    `템/전/원      ${profile.ItemAvgLevel}/${profile.CharacterLevel}/${profile.ExpeditionLevel}\n` +
                                    `서버/길드     ${characterInfo.ServerName}/${(profile.GuildName !== '' && profile.GuildName !== null) ? profile.GuildName : '미가입'}\n` +
                                    `체력/공격력    ${profile.Stats[6].Value}/${profile.Stats[7].Value}\n` +
                                    `스킬포인트     ${profile.UsingSkillPoint}/${profile.TotalSkillPoint}\n` +
                                    `${equipmentSet !== null ? `장비세트효과   ${equipmentSet}\n`:'\n'}` + 
                                    `${(extraEffect !== '' && extraEffect !== null) ? `엘릭서         ${extraEffect}\n\n` : '\n'}` +
                                    `${(statsData !== '') ? '[특성정보]\n'+ statsData + '\n\n' : ''}` +
                                    `${(engravingData !== '') ? '[각인정보]\n' + engravingData + '\n\n' : ''}` + 
                                    `${(cardEffect !== '') ? '[카드세트효과]\n' + cardEffect : ''}` +
                                    `${(collects !== '') ? '\n\n[내실]\n' + collects : ''}`;
                    return characterData;
                } else {
                    return '존재하지 않는 계정입니다.';
                }
            } catch (error) {
                return '(일시적인 장애) 로스트아크API(전투정보실)에 문제가 있어 불러올 수 없습니다.'; // 오류를 호출자로 던짐
            }
        } else {
            const characterResult = await characterSearch(characterName)
            if(Array.isArray(characterResult) && characterResult.length === 0) {
                characterData = '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간, 보관된 데이터가 없음)';
            } else {
                const data = characterResult[0];
                characterData = `[캐싱된 데이터] ${data.mokoko_sponsor === 1 ? '🌱 후원자 ':''}[${data.characterClassName}]\n${(data.characterTitle !== '' && data.characterTitle !== null) ? data.characterTitle + ' ' : ''}${data.characterName}\n\n` +
                            `[캐릭터 기본정보]\n` +
                            `템/전/원      ${data.itemLevel}/${data.characterLevel}/${data.expeditionLevel}\n` +
                            `서버/길드     ${data.serverName}/${(data.guildName !== '' && data.guildName !== null) ? data.guildName : '미가입'}\n` +
                            `체력/공격력    ${data.statsHealthPoints}/${data.statsAttactPower}\n` +
                            `스킬포인트     ${data.characterSkillPoint}/${data.characterSkillPoint_total}\n` +
                            `${data.equipmentSet !== null ? `장비세트효과   ${data.equipmentSet}\n`:'\n'}` + 
                            `${(data.elixrEffect !== '' && data.elixrEffect !== null) ? `엘릭서         ${data.elixrEffect}\n\n` : '\n'}` +
                            `${(data.statsInfo !== '') ? '[특성정보]\n'+data.statsInfo + '\n\n' : ''}` +
                            `${(data.engravingInfo !== '') ? '[각인정보]\n' + data.engravingInfo + '\n\n' : ''}` + 
                            `${(data.cardEffectInfo !== '') ? '[카드세트효과]\n' + data.cardEffectInfo : ''}`;
            }
            return characterData;
        }
    } else if (suspendAccountCheck === 200) {
        return '해당 계정은 정지된 계정입니다.';
    } else if (suspendAccountCheck === 202) {
         // 로스트아크 점검중일때
        let characterData = '';
        const characterResult = await characterSearch(characterName)
        .then(res => {
            if(Array.isArray(res) && res.length === 0) {
                characterData = '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간, 보관된 데이터가 없음)';
            } else {
                const data = res[0];
                characterData = `[캐싱된 데이터] ${data.mokoko_sponsor === 1 ? '🌱 후원자 ':''}[${data.characterClassName}]\n${(data.characterTitle !== '' && data.characterTitle !== null) ? data.characterTitle + ' ' : ''}${data.characterName}\n\n` +
                            `[캐릭터 기본정보]\n` +
                            `템/전/원      ${data.itemLevel}/${data.characterLevel}/${data.expeditionLevel}\n` +
                            `서버/길드     ${data.serverName}/${(data.guildName !== '' && data.guildName !== null) ? data.guildName : '미가입'}\n` +
                            `체력/공격력    ${data.statsHealthPoints}/${data.statsAttactPower}\n` +
                            `스킬포인트     ${data.characterSkillPoint}/${data.characterSkillPoint_total}\n` +
                            `${data.equipmentSet !== null ? `장비세트효과   ${data.equipmentSet}\n`:'\n'}` + 
                            `${(data.elixrEffect !== '' && data.elixrEffect !== null) ? `엘릭서         ${data.elixrEffect}\n\n` : '\n'}` +
                            `${(data.statsInfo !== '') ? '[특성정보]\n'+data.statsInfo + '\n\n' : ''}` +
                            `${(data.engravingInfo !== '') ? '[각인정보]\n' + data.engravingInfo + '\n\n' : ''}` + 
                            `${(data.cardEffectInfo !== '') ? '[카드세트효과]\n' + data.cardEffectInfo : ''}`;
            }
        })
        .catch(e => {
            throw e;
        });
        return characterData;
    } else {
        return '해당 계정은 없는 계정입니다.';
    }
}

// 캐릭터명 조회, 만약 없는경우 return 0
const characterSearch = async (characterName: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_CHARACTER_DEFINFO WHERE characterName = ?';
        const selectValues = [characterName];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 캐릭터명 insert
const characterInsert = async (info, data,engraving,statsText,cardEffect,elixirEff,equipmentSet) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const insertColumns = '(characterName, characterClassName, characterTitle, serverName, characterLevel, itemLevel, expeditionLevel, characterSkillPoint, characterSkillPoint_total, guildName, statsHealthPoints, statsAttactPower, statsInfo, cardEffectInfo, engravingInfo, equipmentSet, elixrEffect, regdateTime, updateTime, characterImage)'
        const insertQuery = 'INSERT INTO LOA_CHARACTER_DEFINFO ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)';
        const insertValues = [info.CharacterName, data.CharacterClassName, data.Title, info.ServerName, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, engraving, equipmentSet, elixirEff, data.CharacterImage];
        const result = await queryDb(conn, insertQuery, insertValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 캐릭터명 update
const characterUpdate = async (info,data,engraving,statsText,cardEffect,elixirEff,equipmentSet) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const updateQuery = 'UPDATE LOA_CHARACTER_DEFINFO SET characterTitle = ?, characterLevel = ?, itemLevel = ?, expeditionLevel = ?, characterSkillPoint = ?, characterSkillPoint_total = ?, guildName = ?, statsHealthPoints = ?,' +
                            'statsAttactPower = ?, statsInfo = ?, cardEffectInfo = ?, engravingInfo = ?, updateTime = NOW(), characterImage = ?, elixrEffect = ?, equipmentSet = ?, serverName = ? WHERE characterName = ?';
        const updateValues = [data.Title, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, engraving, data.CharacterImage, elixirEff, equipmentSet, info.ServerName, data.CharacterName];
        const result = await queryDb(conn, updateQuery, updateValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getCharacterInfoText;