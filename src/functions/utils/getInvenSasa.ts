import axios from 'axios';
import Cheerio from 'cheerio';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const getInvenSasa = async (characterName:string) => {
    const invenUrl = `https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=${characterName}`;
    const sasaUrl = `https://loaapi.2er0.io/util/invenSasa/${characterName}`
    try {

            const listHtmlResponse = await axios.get(`${invenUrl}`);
            const $ = Cheerio.load(listHtmlResponse.data);
            const invenSasa = $('div.board-list table tbody').children();
            const invenSasaList = [];
            
            // 한개 이상 초과되는 공백 제거
            $('*').each(function() {
                $(this).html($(this).html().replace(/[\t\n\r ]+/g, ' ').trim());
            });

            if($('div.no-result').length > 0) {
                return '대상자가 없습니다.';
            }
            
            for (let i = 0; i < invenSasa.length; i++) {
                if(i === 0) continue;
                const element = invenSasa[i];
                const sasaUserTitle = $(element).find('.subject-link')
                const sasaUserLink = sasaUserTitle.attr('href')
                invenSasaList.push(`${sasaUserTitle.text()}`)
            }
            
            return `[${characterName} 유저 사사게 조회결과 (${invenSasaList.length}건)]\n -${invenSasaList.join('\n-')}\n\n${sasaUrl}`

    } catch (error) {
        console.error('Error fetching patch news:', error);
        return [];
    }
};


// 패치 조회, 만약 없는경우 return 0
const patchNewsSearch = async () => {
    const conn = initDb();
    await connectDb(conn);
    try {
        // const selectQuery = 'SELECT * FROM LOA_PATCHNEWS_INFO WHERE STR_TO_DATE(news_uploadDate, \'%Y-%m-%d\') >= CURDATE()';
        // const selectQuery = "SELECT * FROM LOA_PATCHNEWS_INFO WHERE STR_TO_DATE(news_uploadDate, '%Y-%m-%d') BETWEEN STR_TO_DATE(CASE WHEN DAYOFWEEK(NOW()) = 4 THEN DATE_SUB(NOW(), INTERVAL 7 DAY) ELSE DATE_SUB(DATE_ADD(NOW(), INTERVAL (3 - DAYOFWEEK(NOW())) DAY), INTERVAL 7 DAY) END, '%Y-%m-%d') AND STR_TO_DATE(CASE WHEN DAYOFWEEK(NOW()) = 4 THEN DATE_ADD(NOW(), INTERVAL 6 DAY) ELSE DATE_ADD(NOW(), INTERVAL (3 - DAYOFWEEK(NOW())) DAY) END, '%Y-%m-%d') ORDER BY news_uploadDate DESC LIMIT 0, 1";
        const selectQuery = "SELECT * FROM LOA_PATCHNEWS_INFO WHERE STR_TO_DATE(news_uploadDate, '%Y-%m-%d') BETWEEN CASE WHEN DAYOFWEEK(NOW()) = 4 THEN STR_TO_DATE(DATE(NOW()), '%Y-%m-%d') ELSE STR_TO_DATE(DATE_SUB(NOW(), INTERVAL (DAYOFWEEK(NOW()) - 4) DAY), '%Y-%m-%d') END AND CASE WHEN DAYOFWEEK(NOW()) = 4 THEN STR_TO_DATE(DATE_ADD(NOW(), INTERVAL 6 DAY), '%Y-%m-%d') ELSE STR_TO_DATE(DATE_ADD(NOW(), INTERVAL (9 - DAYOFWEEK(NOW())) DAY), '%Y-%m-%d') END ORDER BY news_uploadDate DESC LIMIT 0, 1";
        const result = await queryDb(conn, selectQuery);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 뉴스 insert
const patchNewsInsert = async (data) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const insertColumns = '(news_title, news_uploadDate, news_content)'
        const insertQuery = 'INSERT INTO LOA_PATCHNEWS_INFO ' + insertColumns + ' VALUES (?,?,?)';
        const insertValues = [data.title, data.time, data.content];
        const result = await queryDb(conn, insertQuery, insertValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}