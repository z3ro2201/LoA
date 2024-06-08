import axios from 'axios';
import Cheerio from 'cheerio';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const getPatchnews = async () => {
    const lostarkNewsListUrl = 'https://lostark.game.onstove.com/News/Notice/List';
    const lostarkHomeUrl = 'https://lostark.game.onstove.com';
    
    try {

        // UTC 날짜 구하기
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();
        const utcMilliseconds = now.getUTCMilliseconds();

        // UTC 기준으로 현재 날짜 객체 생성
        const todayUTC = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHours, utcMinutes, utcSeconds, utcMilliseconds));

        // KST (UTC + 9시간)
        const kstOffSet = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
        const todayKST = new Date(todayUTC.getTime() + kstOffSet);
        
        // UTC 기준 요일 계산
        const dayOfWeekKST = todayUTC.getUTCDay();
        let isWednesday;
        
        console.log(todayKST)
        todayKST.setUTCHours(0, 0, 0, 0);
        if (dayOfWeekKST === 3) {
            // 로요일이거나, 로요일이 지나면
            todayKST.setUTCDate(todayKST.getUTCDate());
        } else {
            // 로요일이 아니면 이전주 로요일로
            todayKST.setUTCDate(todayKST.getUTCDate() - dayOfWeekKST + 2);
        }
        
        isWednesday = new Date(todayKST);
        
        const localPatchNewsResult = await patchNewsSearch();

        if(localPatchNewsResult.length === 0) {

            const articles = [];

            const listHtmlResponse = await axios.get(lostarkNewsListUrl);
            const $ = Cheerio.load(listHtmlResponse.data);
            const isNewsListDiv = $('div.list.list--default').length > 0;
            const newsListDiv = $('div.list.list--default').children();

            for (let i = 0; i < newsListDiv.length; i++) {
                const element = newsListDiv[i];
                const dateElement = $(element).find('.list__date'); // list__date 요소를 찾습니다
                
                if (dateElement.length > 0) {
                    const dateText = dateElement.text().trim();
                    const dateParts = dateText.split('.');
                    const dates = dateParts[2].slice(0, 2);
                    const newsDate = new Date(Date.UTC(Number(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dates), 0, 0, 0, 0));

                    if (newsDate.getTime() === todayKST.getTime()) {
                        const closestAnchor = dateElement.closest('a'); // 가장 가까운 'a' 요소를 찾습니다
                        
                        if (closestAnchor.find('.list__title').text().includes('업데이트 내역 안내')) {
                            const newsURL = lostarkHomeUrl + closestAnchor.attr('href');
                            const newsResponse = await axios.get(newsURL);
                            const $article = Cheerio.load(newsResponse.data);
                            const articleTitle = $article('.article__title').text();
                            const articleDatetime = $article('.article__date').text();
                            const articleContent = $article('.fr-view').html().trim().replace(/\n/g, '').split(/<br>/g).filter(item => item !== '' && item !== null && item !== undefined)

                            const articleContents = [];
                            
                            let count = 0;
                            articleContent.forEach(item => {
                                if(item.includes('hr')) count++;
                                if(count === 1) {
                                    const cleanedString = item.replace(/<li>/g, '\n- ').replace('</li>', '').replace(/<[^>]*>/g, '').replace('[', "\n[").replace(']', "]").replace(/&lt;/g, '<')  // &lt;를 <로 변환
                                    .replace(/&gt;/g, '>')   // &gt;를 >로 변환
                                    .replace(/&nbsp;/g, ' ') // &nbsp;를 공백으로 변환
                                    .replace(/&amp;/g, '&'); // &amp;를 &로 변환
                                    articleContents.push(cleanedString);
                                }
                            });
                            
                            articles.push({
                                title: articleTitle,
                                content: articleContents.join("\n")
                            });

                            patchNewsInsert({
                                title: articleTitle,
                                time: newsDate,
                                content: articleContents.join("\n")
                            })
                            
                        }
                    }
                }
            }

            return articles;
            
        } else {
            return localPatchNewsResult
        }
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
        const selectQuery = 'SELECT * FROM LOA_PATCHNEWS_INFO WHERE STR_TO_DATE(news_uploadDate, \'%Y-%m-%d\') <= CURDATE()';
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