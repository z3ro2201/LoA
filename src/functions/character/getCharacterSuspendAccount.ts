import axios from 'axios'
import Cheerio from 'cheerio'
import global from '../../config/config'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import {apiCheck} from '../utils/apiCheck'

export const getCharacterSuspendAccount = async (characterName : string) => {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    // const lostarkHomeUrl = `https://lostark.game.onstove.com/Profile/Character/${characterName}`;
    const lostarkHomeUrl = `https://m-lostark.game.onstove.com/Profile/Character/${characterName}`;

    const localSuspendResult = await characterSearch(characterName);
    if(localSuspendResult.length === 0) {
        const apiStatus = await apiCheck();
        if(apiStatus === true) {
            try {
                const response = await axios.get(apiUrl, {
                    headers: global.token.lostarkHeader
                });
                
                // openapi 상태
                const openapiAccountSta = response.data;

                // 전투정보실 상태
                const htmlResponse = await axios.get(lostarkHomeUrl);
                const $ = Cheerio.load(htmlResponse.data);
                const isDiv = $('div.profile-attention').length > 0;
                
                if(isDiv && openapiAccountSta) { // 둘 다 있으니 정지된 계정으로 판단 (만약 정상계정이면 isDiv는 0이 되어야 함.)
                    await characterInsert(openapiAccountSta.ArmoryProfile);
                    return 200;
                }
                else if(!isDiv && openapiAccountSta) { // 전투정보실에 attention 은 없고 openapi 데이터가 있는경우 정상계정으로 판단
                    return 204;
                } else { // 둘다 없으면 삭제되거나 없는 계정으로 판단
                    return 404;
                }
            } catch (e) {
                throw e;
            }
        } else {
            return 202;
        }
    } else {
        return 200;
    }
        
}

// 캐릭터명 조회, 만약 없는경우 return 0
const characterSearch = async (characterName: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_CHARACTER_SUSPEND WHERE characterName = ?';
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
const characterInsert = async (data) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const insertColumns = '(characterName, serverName, regDate)'
        const insertQuery = 'INSERT INTO LOA_CHARACTER_SUSPEND ' + insertColumns + ' VALUES (?,?,NOW())';
        const insertValues = [data.CharacterName, data.ServerName];
        const result = await queryDb(conn, insertQuery, insertValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}