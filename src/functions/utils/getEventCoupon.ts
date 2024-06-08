import axios from 'axios';
import Cheerio from 'cheerio';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

const dateConvert = (stringDate:string) => {
    const dates = new Date(stringDate);
    const year = dates.getFullYear();
    const month = (dates.getMonth() + 1).toString().padStart(2, '0');
    const day = (dates.getDate()).toString().padStart(2, '0');

    return `${year}-${month}-${day}`
}

export const getEventCoupon = async () => {
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
        
        // KST 날짜 포맷팅
        const year = todayKST.getFullYear();
        const month = String(todayKST.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
        const day = String(todayKST.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤

        const lostarkEventCoupon = await couponSearch(`${year}-${month}-${day}`);

        if(lostarkEventCoupon.length === 0) {
        } else {
            const couponRegistUrl = 'https://lostark.game.onstove.com/Coupon/Available';
            const couponListArr = [];
            lostarkEventCoupon.forEach(item => {
                const tmpStartDate = dateConvert(item.coupon_startdate);
                const tmpEndDate = dateConvert(item.coupon_enddate);
                couponListArr.push(`[${item.coupon_name}]\n${item.coupon_code} (${tmpStartDate} ~ ${tmpEndDate})`)
            })
            return `${couponListArr.join('\n\n')}\n\n- 등록: ${couponRegistUrl}`
        }
    } catch (error) {
        console.error('Error fetching patch news:', error);
        return [];
    }
};


// 쿠폰 조회, 만약 없는경우 return 0
const couponSearch = async (today: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_COUPON WHERE ? BETWEEN coupon_startdate AND coupon_enddate';
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