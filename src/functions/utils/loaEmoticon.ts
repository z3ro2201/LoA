import global from '../../config/config'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '~로아콘',
    help: '로아콘 이름',
    description: '로아콘을 보여드립니다.'
}

export const getEmoticon = async (emoticonName : string) => {
    const loaconResult = await loaconSearch(emoticonName);
    if(loaconResult.length === 0) {
        return 204;
    } else {
        return loaconResult[0];
    }        
}

// 이모티콘 조회, 만약 없는경우 return 0
const loaconSearch = async (emoticonName: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_EMOTICON WHERE EMO_NAME LIKE ?';
        const selectValues = [`%${emoticonName}%`];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}