import axios from 'axios'
import Cheerio from 'cheerio'
import global from '../../config/config'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import {apiCheck} from '../utils/apiCheck'

export const getCharacterSuspendAccount = async (characterName : string, mode: number = 0) => {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    // const lostarkHomeUrl = `https://lostark.game.onstove.com/Profile/Character/${characterName}`;
    const lostarkHomeUrl = `https://lostark.game.onstove.com/Profile/Character/${characterName}`;

    const localSuspendResult = await characterSearch(characterName);
    if(mode === 0 && localSuspendResult.length === 0) {
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
                const notFoundCharacterHtml = (isDiv) ? $('div.profile-attention').text() : null
                const notFoundCharacterMessage = (notFoundCharacterHtml && notFoundCharacterHtml.includes("캐릭터 정보가 없습니다")) ? 204 : ((notFoundCharacterHtml && notFoundCharacterHtml.includes("최신화된 캐릭터 정보")) ? 201 : 200);
                console.log(notFoundCharacterMessage)
                if(notFoundCharacterMessage === 201) {
                    return { code: 201, message: '[SEASON 3] 최신화 된 정보가 필요합니다.'}
                }
                else if(notFoundCharacterMessage === 204 && openapiAccountSta) { // 둘 다 있으니 정지된 계정으로 판단 (만약 정상계정이면 isDiv는 0이 되어야 함.)
                    await characterInsert(openapiAccountSta.ArmoryProfile);
                    return {code: 200, message: '정상'};
                }
                else if(notFoundCharacterMessage === 200 && openapiAccountSta) { // 전투정보실에 attention 은 없고 openapi 데이터가 있는경우 정상계정으로 판단
                    return {code: 204, message: '정상'};
                } else { // 둘다 없으면 삭제되거나 없는 계정으로 판단
                    return {code: 404, message: '존재하지 않는 계정 입니다.'};
                }
            } catch (e) {
                throw e;
            }
        } else {
            return {code: 202, message: ''};
        }
    } else if(mode === 0 && localSuspendResult.length === 0) {
        return {code: 204, message: '정상 계정입니다.'};
    } else {
        return {code: 200, message: ''};
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