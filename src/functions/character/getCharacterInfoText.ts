import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '캐릭터',
    help: '[캐릭터이름]',
    description: '캐릭터 정보를 볼 수 있습니다.'
}

async function getCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        console.log('a')

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
            for(var tmp of profile.Stats) {
                if(i > 5) break;
                const tmpData = `${tmp.Type.replace(/(.)./g, '$1')}+${tmp.Value}`;
                statsArr.push(tmpData);
                i++;
            }

            // 서버 응답을 파싱하여 캐릭터 정보를 추출
            const characterTitle = (profile.Title === null) ? '' : `${profile.Title} `;
            const guildName = (profile.GuildName === null) ? '미가입' : profile.GuildName;
            let engravingText = '';
            let statsText = (statsArr.length > 0) ? `[특성정보]\n${statsArr.join(', ')}` : '';
            
            const engravingEffect = [];
            if(engraving.Effects !== null) {
                for(let tmp of engraving.Effects) {
                    engravingEffect.push(tmp.Name.replace(' Lv.', ''));
                }
                if(engravingEffect.length > 0) {
                    engravingText += `${engravingEffect.join(', ')}\n`;
                }
            }

            // 활성화된 세트효과
            const cardEffectArr = [];
            for(const tmp of card.Effects[0].Items) {
                cardEffectArr.push(`${tmp.Name}`);
            }

            // 데이터를 리턴할 변수
            let characterData = '';
            // 데이터 삽입 및 데이터 업데이트
            const characterResult = await characterSearch(characterName)
            .then(res => {
                if(Array.isArray(res) && res.length === 0) {
                    const engravingData = (engravingEffect.length > 0) ? engravingEffect.join(', ') : '';
                    const statsData = (statsArr.length > 0) ? statsArr.join(', ') : '';
                    const cardEffect = (cardEffectArr.length > 0) ? cardEffectArr[cardEffectArr.length - 1] : '';
                    characterInsert(profile, engravingData, statsData, cardEffect);
                    return characterSearch(characterName);
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
                    } return characterSearch(characterName);
                }
            })
            .then(updateRes => {
                const data = updateRes[0];
                console.log(data.mokoko_sponsor);
                characterData = `${data.mokoko_sponsor === 1 ? '[🌱 후원자] ':''}[${data.characterClassName}]\n${(data.characterTitle !== '' && data.characterTitle !== null) ? data.characterTitle + ' ' : ''}${data.characterName}\n\n` +
                            `[캐릭터 기본정보]\n` +
                            `템/전/원      ${data.itemLevel}/${data.characterLevel}/${data.expeditionLevel}\n` +
                            `서버/길드     ${data.serverName}/${(data.guildName !== '' && data.guildName !== null) ? data.guildName : '미가입'}\n` +
                            `체력/공격력    ${data.statsHealthPoints}/${data.statsAttactPower}\n` +
                            `스킬포인트     ${data.characterSkillPoint}/${data.characterSkillPoint_total}\n\n` +
                            `${(data.statsInfo !== '') ? '[특성정보]\n'+data.statsInfo + '\n\n' : ''}` +
                            `${(data.engravingInfo !== '') ? '[각인정보]\n' + data.engravingInfo + '\n\n' : ''}` + 
                            `${(data.cardEffectInfo !== '') ? '[카드세트효과]\n' + data.cardEffectInfo : ''}`;
            })
            .catch(error => console.error(error));
            

            return characterData;
            
        } catch (error) {
            throw error; // 오류를 호출자로 던짐
        }
    } else {
        console.log('b')
        // 로스트아크 점검중일때
        let characterData = '';
        const characterResult = await characterSearch(characterName)
        .then(res => {
            if(Array.isArray(res) && res.length === 0) {
                console.log('a1')
                characterData = '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간, 보관된 데이터가 없음)';
            } else {
                const data = res[0];
                characterData = `[캐싱된 데이터] ${data.mokoko_sponsor === 1 ? '[🌱 후원자] ':''}[${data.characterClassName}]\n${(data.characterTitle !== '' && data.characterTitle !== null) ? data.characterTitle + ' ' : ''}${data.characterName}\n\n` +
                            `[캐릭터 기본정보]\n` +
                            `템/전/원      ${data.itemLevel}/${data.characterLevel}/${data.expeditionLevel}\n` +
                            `서버/길드     ${data.serverName}/${(data.guildName !== '' && data.guildName !== null) ? data.guildName : '미가입'}\n` +
                            `체력/공격력    ${data.statsHealthPoints}/${data.statsAttactPower}\n` +
                            `스킬포인트     ${data.characterSkillPoint}/${data.characterSkillPoint_total}\n\n` +
                            `${(data.statsInfo !== '') ? '[특성정보]\n'+data.statsInfo + '\n\n' : ''}` +
                            `${(data.engravingInfo !== '') ? '[각인정보]\n' + data.engravingInfo + '\n\n' : ''}` + 
                            `${(data.cardEffectInfo !== '') ? '[카드세트효과]\n' + data.cardEffectInfo : ''}`;
            }
        })
        .catch(e => {
            throw e;
        });
        return characterData;
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
        const insertColumns = '(characterName, characterClassName, characterTitle, serverName, characterLevel, itemLevel, expeditionLevel, characterSkillPoint, characterSkillPoint_total, guildName, statsHealthPoints, statsAttactPower, statsInfo, cardEffectInfo, engravingInfo, regdateTime, updateTime, characterImage)'
        const insertQuery = 'INSERT INTO LOA_CHARACTER_DEFINFO ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW(),?)';
        const insertValues = [data.CharacterName, data.CharacterClassName, data.Title, data.ServerName, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, data.Stats[6].Value, data.Stats[7].Value, statsText, cardEffect, engraving, data.CharacterImage];
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
        const updateQuery = 'UPDATE LOA_CHARACTER_DEFINFO SET characterTitle = ?, characterLevel = ?, itemLevel = ?, expeditionLevel = ?, characterSkillPoint = ?, characterSkillPoint_total = ?, guildName = ?, statsHealthPoints = ?,' +
                            'statsAttactPower = ?, statsInfo = ?, cardEffectInfo = ?, engravingInfo = ?, updateTime = NOW(), characterImage = ? WHERE characterName = ? AND serverName = ?';
        const updateValues = [data.Title, data.CharacterLevel, data.ItemAvgLevel, data.ExpeditionLevel, data.UsingSkillPoint, data.TotalSkillPoint, data.GuildName, data.Stats[6].Value, data.Stats[7].Value, statsText, cardEffect, engraving, data.CharacterImage, data.CharacterName, data.ServerName];
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