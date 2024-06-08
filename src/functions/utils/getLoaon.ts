import axios from 'axios';
import Cheerio from 'cheerio';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

const dateConvert = (stringDate:string, hypenType: string, times: boolean) => {
    const dates = new Date(stringDate);

    const kstOffSet = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const todayKST = new Date(dates.getTime() + kstOffSet);

    const year = todayKST.getFullYear();
    const month = (todayKST.getMonth() + 1).toString().padStart(2, '0');
    const day = (todayKST.getDate()).toString().padStart(2, '0');

    const hour = dates.getHours().toString().padStart(2, '0');
    const minute = dates.getMinutes().toString().padStart(2, '0');
    
    const strDate = `${year}${hypenType}${month}${hypenType}${day}`;
    const strTime = (times === true) ? ` ${hour}시 ${minute}분` : ''
    return `${strDate}${strTime}`
}

const timeConvert = (stringDatetime:string) => {
    const dates = new Date(stringDatetime);
    
    const kstOffSet = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const todayKST = new Date(dates.getTime() + kstOffSet);

    return dates.getTime()
}

export const getLOAONData = async () => {
    
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
        
        // KST 날짜 포맷팅
        const convertDate = dateConvert(todayKST.toISOString(), '-', false);

        // const lostarkFestivalVideoData = await loaonSearch(`${year}-${month}-${day}`);
        const lostarkFestivalVideoData = await loaonSearch(convertDate);

        if(lostarkFestivalVideoData.length === 0) {
            return '로아온 정보가 없습니다.'
        } else {
            const loaonListArr = [];
            lostarkFestivalVideoData.forEach(item => {
                const loaonTitle = `[${item.loaon_title}]`;
                const loaonEventDate = dateConvert(item.loaon_startdatetime, '.', true);
                const loaonLiveTime = timeConvert(item.loaon_livetime);
                const nowTime = todayKST.getTime();
                const loaonLiveUrl = (nowTime >= loaonLiveTime) ? `\n라이브: ${item.loaon_liveurl}` : '';
                const loaonEventUrl = `\n이벤트정보: ${item.loaon_eventUrl}`;
                loaonListArr.push(`[${loaonTitle}]\n${loaonEventDate}${loaonLiveUrl}${loaonEventUrl}`)
            })
            return `${loaonListArr.join('\n')}`
        }
    } catch (error) {
        console.error('Error fetching patch news:', error);
        return [];
    }
};


// 쿠폰 조회, 만약 없는경우 return 0
const loaonSearch = async (today: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_FESTIVAL_LIVE WHERE STR_TO_DATE(loaon_date, \'%Y-%m-%d\') <= ?';
        const selectValues = [today];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}