import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import getCharacterData from './getCharacterData';

interface subCharacterList {
    combatLevel: number,
    itemLevel: number
}

async function getAllServerSubCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}characters/${characterName}/siblings`;
    const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
    if(suspendAccountCheck === 204) {
        const apiStatus = await apiCheck();
        if(apiStatus === false) {
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });

                const data = response.data;

                // 캐릭터목록
                const characterServer = data.filter(characterData => characterData.CharacterName === characterName);
                const characterListArr = [];
                for(const tmp of data) {
                    characterListArr.push({combatLevel: tmp.CharacterLevel, itemLevel: parseFloat(tmp.ItemAvgLevel.replace(',', '')), textStr: `${tmp.CharacterLevel.toString().padStart(2, '0')} ${tmp.CharacterClassName}  ${tmp.CharacterName}  (${tmp.ItemAvgLevel})`})
                }

                // 레벨 순 정렬
                characterListArr.sort((a:subCharacterList, b:subCharacterList) => {
                    return b.itemLevel - a.itemLevel;
                })

                // combatLevel, itemLevel 삭제 후 textStr만 남기기
                const sortedCharacterListArr = characterListArr.map(({textStr}) => ({textStr}));

                // 정렬된 배열을 기반으로 문자열 생성 및 추가
                const characterResult = await characterSearch(characterName)
                .then(res => {
                    if(Array.isArray(res) && res.length === 0) {
                        const characterDataArr = sortedCharacterListArr.map(character => character.textStr);
                        const characterData = characterDataArr//`[${characterServer[0].ServerName} 서버]\n${characterDataArr.join('\n')}\n\n총 ${characterDataArr.length}개의 캐릭터 보유`;
                        console.log(characterDataArr)
                        return characterDataArr;
                    }
                });


            } catch (error) {
                throw error; // 오류를 호출자로 던짐
            }
        }
    } else if (suspendAccountCheck === 200) {
        return '해당 계정은 정지된 계정입니다.';
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
const characterInsert = async (info, data, engraving, professEngraving, statsText, cardEffect, elixirEff, equipmentSet) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const insertColumns = '(characterName, characterClassName, characterTitle, serverName, characterLevel, itemLevel, expeditionLevel, characterSkillPoint, characterSkillPoint_total, guildName, statsHealthPoints, statsAttactPower, statsInfo, cardEffectInfo, professionalEng, engravingInfo, equipmentSet, elixrEffect, regdateTime, updateTime, characterImage)'
        const insertQuery = 'INSERT INTO LOA_CHARACTER_DEFINFO ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)';
        const insertValues = [info.CharacterName, data.CharacterClassName, data.Title, info.ServerName, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, professEngraving, engraving, equipmentSet, elixirEff, data.CharacterImage];
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
const characterUpdate = async (info,data,engraving,professEngraving,statsText,cardEffect,elixirEff,equipmentSet) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const statsValue1 = data.Stats && data.Stats[6] ? data.Stats[6].Value : '';
        const statsValue2 = data.Stats && data.Stats[7] ? data.Stats[7].Value : '';
        const updateQuery = 'UPDATE LOA_CHARACTER_DEFINFO SET characterTitle = ?, characterLevel = ?, itemLevel = ?, expeditionLevel = ?, characterSkillPoint = ?, characterSkillPoint_total = ?, guildName = ?, statsHealthPoints = ?,' +
                            'statsAttactPower = ?, statsInfo = ?, cardEffectInfo = ?, professionalEng = ?, engravingInfo = ?, updateTime = NOW(), characterImage = ?, elixrEffect = ?, equipmentSet = ?, serverName = ? WHERE characterName = ?';
        const updateValues = [data.Title, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, statsValue1, statsValue2, statsText, cardEffect, professEngraving, engraving, data.CharacterImage, elixirEff, equipmentSet, info.ServerName, data.CharacterName];
        const result = await queryDb(conn, updateQuery, updateValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getAllServerSubCharacterInfoText;