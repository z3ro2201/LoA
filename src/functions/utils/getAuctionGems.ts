import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '경매보석',
    help: '/경매보석 [보석종류]',
    description: '경매장 보석정보를 보여드립니다.'
}

async function getAuctionGems(strItemName) {
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
        {shortName: '10홍', itemName: '10레벨 홍염'},
        {shortName: '1겁', itemName: '1레벨 겁화'},
        {shortName: '2겁', itemName: '2레벨 겁화'},
        {shortName: '3겁', itemName: '3레벨 겁화'},
        {shortName: '4겁', itemName: '4레벨 겁화'},
        {shortName: '5겁', itemName: '5레벨 겁화'},
        {shortName: '6겁', itemName: '6레벨 겁화'},
        {shortName: '7겁', itemName: '7레벨 겁화'},
        {shortName: '8겁', itemName: '8레벨 겁화'},
        {shortName: '9겁', itemName: '9레벨 겁화'},
        {shortName: '10겁', itemName: '10레벨 겁화'},
        {shortName: '1작', itemName: '1레벨 작열'},
        {shortName: '2작', itemName: '2레벨 작열'},
        {shortName: '3작', itemName: '3레벨 작열'},
        {shortName: '4작', itemName: '4레벨 작열'},
        {shortName: '5작', itemName: '5레벨 작열'},
        {shortName: '6작', itemName: '6레벨 작열'},
        {shortName: '7작', itemName: '7레벨 작열'},
        {shortName: '8작', itemName: '8레벨 작열'},
        {shortName: '9작', itemName: '9레벨 작열'},
        {shortName: '10작', itemName: '10레벨 작열'}
    ];


    if(apiStatus === true) {

        const foundGemstone = gemstoneArray.find(gemstone => gemstone.shortName === strItemName);
        const itemName = foundGemstone ? foundGemstone.itemName : null;

        if(itemName === null) return {
            code: 204,
            error: {
                message: '보석정보를 입력해주세요. (/경매보석 [1홍] [10멸] [1겁] [1작])'
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
            
            const gemstone = await gemstoneData(itemName);

            if(gemstone.length > 0) {
                const yesterdayPrice = gemstone[0].item_amount;

                // 전일 대비 변화량 계산
                const changeAmount   =  lowAmount - yesterdayPrice;

                // 전일 대비 퍼센트 변화율 계산
                const percentChange = (changeAmount / yesterdayPrice) * 100;

                return {
                    code: 200,
                    message: `${itemName} 최저가: ${lowAmount.toLocaleString('ko-KR')}\n전일대비: ${changeAmount.toLocaleString('ko-KR')} (${percentChange.toFixed(2)}%)\n\n시세차트: https://loaapi.2er0.io/util/gemstoneChart/${strItemName}`
                };
            } else {
                return {
                    code: 200,
                    message: `${itemName} 최저가 ${lowAmount.toLocaleString('ko-KR')}`
                };
            }


        } catch (error) {
        console.error(error)
        }
        
    }
}

// 전일 마지막 시세내용
const gemstoneData = async (gemstoneName) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT item_name, item_amount, item_registDateTime FROM LOA_AUCTION_GEMS_PRICE WHERE item_name = ? AND item_registDateTime >= DATE(NOW() - INTERVAL 1 DAY) AND item_registDateTime < DATE(NOW()) ORDER BY item_registDateTime DESC LIMIT 1';
        const selectValues = [gemstoneName];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getAuctionGems