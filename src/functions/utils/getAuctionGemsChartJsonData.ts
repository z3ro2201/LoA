import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from './apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '경매보석',
    help: '/경매보석 [보석종류]',
    description: '경매장 보석정보를 보여드립니다.'
}

async function getAuctionGemsChartJsonData(strItemName, strSyncTime = '1h') {
    const apiStatus = await apiCheck();
    const apiUrl = `${global.apiUrl.lostark}auctions/items`;

    // 로스트아크 API 설정
    const gemstoneCategoryCode:number = 210000;
    const gemstoneCategorySort:string = 'BUY_PRICE';

    // 보석 목록
    const gemstoneArray:{ shortName: string, itemName: string} [] = [
        {shortName: '1멸', itemName: '1레벨 멸화'},
        {shortName: '2멸', itemName: '2레벨 멸화'},
        {shortName: '3멸', itemName: '3레벨 멸화'},
        {shortName: '4멸', itemName: '4레벨 멸화'},
        {shortName: '5멸', itemName: '5레벨 멸화'},
        {shortName: '6멸', itemName: '6레벨 멸화'},
        {shortName: '7멸', itemName: '7레벨 멸화'},
        {shortName: '8멸', itemName: '8레벨 멸화'},
        {shortName: '9멸', itemName: '9레벨 멸화'},
        {shortName: '10멸', itemName: '10레벨 멸화'},
        {shortName: '1홍', itemName: '1레벨 홍염'},
        {shortName: '2홍', itemName: '2레벨 홍염'},
        {shortName: '3홍', itemName: '3레벨 홍염'},
        {shortName: '4홍', itemName: '4레벨 홍염'},
        {shortName: '5홍', itemName: '5레벨 홍염'},
        {shortName: '6홍', itemName: '6레벨 홍염'},
        {shortName: '7홍', itemName: '7레벨 홍염'},
        {shortName: '8홍', itemName: '8레벨 홍염'},
        {shortName: '9홍', itemName: '9레벨 홍염'},
        {shortName: '10홍', itemName: '10레벨 홍염'}
    ];


    if(apiStatus === true) {

        const foundGemstone = gemstoneArray.find(gemstone => gemstone.shortName === strItemName);
        const itemName = foundGemstone ? foundGemstone.itemName : null;

        if(itemName === null) return {
            code: 204,
            error: {
                message: '보석정보를 입력해주세요. (/경매보석 [1홍] [10멸])'
            }
        };

        const data = {
            CategoryCode: gemstoneCategoryCode,
            Sort: gemstoneCategorySort,
            ItemName: itemName,
        }
        try {
            const auctionApi = `${global.apiUrl.lostark}auctions/items`;
            const response = await axios.post(auctionApi, data, {
                headers: global.token.lostarkHeader
            });
            const res = response.data;
            const lowAmount = res.Items[0].AuctionInfo.BuyPrice;
            const itemName  = res.Items[0].Name;
            
            const gemstone = await gemstoneData(itemName, strSyncTime);

            if(gemstone.length > 0) {
                return {
                    code: 200,
                    message: '데이터를 성공적으로 조회했습니다.',
                    data: gemstone
                };
            } else {
                return {
                    code: 204,
                    message: `데이터가 존재하지 않습니다.`
                };
            }


        } catch (error) {
        console.error(error)
        }
        
    }
}

// 실시간 차트정보
const gemstoneData = async (gemstoneName, gemstoneTime = '1h') => {
    const conn = initDb();
    await connectDb(conn);
    try {
        let selectQuery = '';
        let selectValues = [];
        if(gemstoneTime === '1h') {
            selectQuery = 'SELECT item_name, item_amount, DATE_FORMAT(item_registDateTime, \'%Y-%m-%d %H:00:00\') AS hourly_registDateTime, item_registDate FROM LOA_AUCTION_GEMS_PRICE WHERE item_name = ? AND item_registDate >= CURDATE() - INTERVAL 1 DAY AND item_registDate <= CURDATE() GROUP BY hourly_registDateTime';
            selectValues = [gemstoneName];
        } else {
            selectQuery = 'SELECT ' +
                          'DATE(item_registDateTime) AS date, ' +
                          'MIN(item_amount) AS lowest_price, ' +
                          'MAX(item_amount) AS highest_price, ' +
                          '(SELECT item_amount FROM LOA_AUCTION_GEMS_PRICE WHERE DATE(item_registDateTime) = DATE_FORMAT(item_registDateTime, \'%Y-%m-%d\') AND item_name = ? ORDER BY item_registDateTime ASC LIMIT 1) AS start_price, ' +
                          '(SELECT item_amount FROM LOA_AUCTION_GEMS_PRICE WHERE DATE(item_registDateTime) = DATE_FORMAT(item_registDateTime, \'%Y-%m-%d\') AND item_name = ? ORDER BY item_registDateTime DESC LIMIT 1) AS end_price ' +
                          'FROM LOA_AUCTION_GEMS_PRICE WHERE item_name = ? ' +
                          'AND item_registDateTime >= CURDATE() - INTERVAL 1 MONTH ' +
                          'AND item_registDateTime <= CURDATE() ' +
                          'GROUP BY DATE(item_registDateTime) ' +
                          'ORDER BY DATE(item_registDateTime) ASC';
            selectValues = [gemstoneName, gemstoneName, gemstoneName];
        }
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getAuctionGemsChartJsonData