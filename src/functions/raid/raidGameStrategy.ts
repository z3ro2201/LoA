import axios from 'axios';
import Cheerio from 'cheerio';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const raidGameList = async () => {
    
    try {


        const lostarkRaidData = await raidList();

        if(lostarkRaidData.length === 0) {
            return '일치하는 정보가 없습니다.'
        } else {
            const raidListArr = [];
            lostarkRaidData.forEach(item => {
                raidListArr.push(item.boss_name);
            })
            return `[레이드 정보] /공략 [${raidListArr.join('|')}]`
        }
    } catch (error) {
        console.error('Error fetching patch news:', error);
        return [];
    }
};

export const raidGameStrategy = async (raidName : string) => {
    
    try {
        const lostarkRaidData = await raidSearch(raidName);

        if(lostarkRaidData.length === 0) {
            return '일치하는 정보가 없습니다.'
        } else {
            let bossname = lostarkRaidData[0].boss_name;
            const raidListArr = [];
            lostarkRaidData.forEach(item => {
                console.log(item)
                raidListArr.push(`${item.boss_phase !== '' && item.boss_phase !== null ? ` [${item.boss_phase}] `:''}${item.boss_url}`)
            })
            return `[${bossname}] ${raidListArr.join('\n')}`
        }
    } catch (error) {
        console.error('Error fetching patch news:', error);
        return [];
    }
};


// 쿠폰 조회, 만약 없는경우 return 0
const raidSearch = async (raidName: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_GAMESTRATEGY_INFO WHERE boss_raidname = ? OR boss_name = ?';
        const selectValues = [raidName, raidName];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 쿠폰 조회, 만약 없는경우 return 0
const raidList = async () => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_GAMESTRATEGY_INFO GROUP BY boss_name';
        const result = await queryDb(conn, selectQuery);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}