import axios from 'axios'
import global from '../../config/config'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

async function getCharacterData(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });
        const profile = response.data.ArmoryProfile;
        const engraving = response.data.ArmoryEngraving;
        const card = response.data.ArmoryCard;

        // 스탯정보
        const statsArr = [];
        let i:number = 0;
        if(profile.Stats) {
            for(var tmp of profile.Stats) {
                if(i > 5) break;
                const tmpData = `${tmp.Type.replace(/(.)./g, '$1')}+${tmp.Value}`;
                statsArr.push(tmpData);
                i++;
            }
        }
            
        let engravingText = '';
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

        const characterResult = await characterSearch(characterName)
        .then(res => {
            if(Array.isArray(res) && res.length === 0) {
                const engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                const statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                const cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                characterInsert(profile, engravingData, statsData, cardEffect);
            } else {
                const now: Date = new Date();
                const updateTime: Date = new Date(res[0].updateTime);
                const timeDifference = now.getTime() - updateTime.getTime();
                const minutesDifference = timeDifference / (1000 * 60);
                if (Array.isArray(res) && res.length > 0 && minutesDifference >= 3) { // 데이터는 존재하나 3분 이상이 지난경우
                    const engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                    const statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                    const cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                    characterUpdate(profile, engravingData, statsData, cardEffect);
                }
            }
        })
    } catch (e) {
        throw e;
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
        const insertColumns = '(characterName, characterClassName, characterTitle, serverName, characterLevel, itemLevel, expeditionLevel, characterSkillPoint, characterSkillPoint_total, guildName, statsHealthPoints, statsAttactPower, statsInfo, cardEffectInfo, engravingInfo, regdateTime, updateTime, characterImage)'
        const insertQuery = 'INSERT INTO LOA_CHARACTER_DEFINFO ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)';
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
export default getCharacterData;