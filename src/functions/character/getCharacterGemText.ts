import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import getCharacterData from './getCharacterData';

interface gems {
    level: number
}
interface TooltipElement {
    type: string;
    value: string | TooltipValue;
  }
  
  interface TooltipValue {
    bEquip?: number;
    leftStr0?: string;
    leftStr2?: string;
    qualityValue?: number;
    rightStr0?: string;
    slotData?: Record<string, any>;
    [key: string]: any;
  }
  
  interface TooltipData {
    [key: string]: TooltipElement;
  }
async function getCharacterGemText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bgems`;

    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        if(suspendAccountCheck.code === 204) {
            const updateData = await getCharacterData(characterName);
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });
                

                if(response.data !== null) {
                    const gems = response.data.ArmoryGem;
                    if(gems.Gems === null) {
                        return '보석을 장착하지 않은것 같습니다.'
                    }

                    // 보석정보
                    const gemsList = [];
                    const gemsTmpArr = [];
                    let i:number = 0;
                    for(const tmp of gems.Gems) {
                        const matches = tmp.Name.replace(global.regex.htmlEntity, '').match(/(\d+)\S* (\S*)의 보석/);
                        const toolTip:TooltipData  =JSON.parse(tmp.Tooltip.replace(/\r\n/g, ''))
                        const tooltipArray =  Object.values(toolTip)
                        const filteredItems = tooltipArray.filter((item) => item.type === 'ItemPartBox');
                        const skillsName = filteredItems[0].value['Element_001'].split('<BR>')[0].replace(global.regex.htmlEntity, '').replace(/\s*\[.*?\]/g, '');
                        
                        // const skillsName = tmp.filter((item) => tmp.Slot === item.GemSlot)[0];
                        if (matches && matches.length === 3) {
                          const level = matches[1];
                          const type = matches[2];
                          gemsTmpArr.push({level: level, gemsName: type, skills: skillsName});
                          
                          //보석 목록에 추가할것
                          const isMatched = gemsList.some(gem => gem.type.includes(type));
                          if(!isMatched) {
                            gemsList.push({type: type, count: 1});
                          } else {
                            const matchedGem = gemsList.find(gem => gem.type === type);
                            if (matchedGem) {
                                matchedGem.count = (matchedGem.count || 0) + 1;
                            }
                          }
                        }

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
                        gemsArr[key].push(`${item.level} ${item.gemsName.length > 1 ? item.gemsName.slice(0,1) : item.gemsName} II ${item.skills}`);
                    })

                    // 서버 응답을 파싱하여 캐릭터 정보를 추출
                    const characterData = [];
                    for(const key in gemsArr) {
                        characterData.push(`\n[${key}]`);
                        gemsArr[key].forEach(data => characterData.push(`${data}`));
                    }

                    const tmpGemsList = [];
                    gemsList.forEach(item => {
                        tmpGemsList.push(`${item.type} (${item.count})`);
                    });

                    return `❙ 보석정보\n❙ 전체 (${i}) ${tmpGemsList.join(' ')}\n━━━━━━━━━━━━━━${characterData.join("\n")}`;
                } else {
                    console.log(suspendAccountCheck)
                    return suspendAccountCheck.message;
                }
            } catch (error) {
                throw error; // 오류를 호출자로 던짐
            }
        } else if (suspendAccountCheck.code === 200) {
            return '해당 계정은 정지된 계정입니다.';
        } else {
            return suspendAccountCheck.message;
        }
    } else {
        return '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간)';
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
const characterInsert = async (data,engraving,statsText,cardEffect) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const insertColumns = '(characterName, serverName, gem1_type, gem1_level, gem1_skills, gem2_type, gem2_level, gem2_skills, gem3_type, gem3_level, gem3_skills, gem4_type, gem4_level, gem4_skills, ' +
                              'gem5_type, gem5_level, gem5_skills, gem6_type, gem6_level, gem6_skills, gem7_type, gem7_level, gem7_skills, gem8_type, gem8_level, gem8_skills, gem9_type, gem9_level, gem9_skills, ' +
                              'gem10_type, gem10_level, gem10_skills, gem11_type, gem11_level, gem11_skills, regDate, upDate)';
        const insertQuery = 'INSERT INTO LOA_CHARACTER_GEMS ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())';
        const insertValues = [data.CharacterName, data.CharacterClassName, data.Title, data.ServerName, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, engraving, data.CharacterImage];
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
const characterUpdate = async (data,engraving,statsText,cardEffect) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const updateQuery = 'UPDATE LOA_CHARACTER_DEFINFO SET characterTitle = ?, characterLevel = ?, itemLevel = ?, expeditionLevel = ?, characterSkillPoint = ?, characterSkillPoint_total = ?, guildName = ?, statsHealthPoints = ?,' +
                            'statsAttactPower = ?, statsInfo = ?, cardEffectInfo = ?, engravingInfo = ?, updateTime = NOW(), characterImage = ? WHERE characterName = ? AND serverName = ?';
        const updateValues = [data.Title, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, engraving, data.CharacterImage, data.CharacterName, data.ServerName];
        const result = await queryDb(conn, updateQuery, updateValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getCharacterGemText;