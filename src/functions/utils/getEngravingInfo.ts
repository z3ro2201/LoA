import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from './apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '각인',
    help: '/각인 [각인종류]',
    description: '각인서 정보를 보여드립니다.'
}

async function getAuctionEngravingData(strEngname) {
    const apiStatus = await apiCheck();
    const getMarketApi = `${global.apiUrl.lostark}markets/items`;

    // 로스트아크 API 설정
    const engravingCategoryCode:number = 40000;
    const engravingCategorySort:string = 'BUY_PRICE';

    const engItemName = strEngname.replace(/\s/g, "");
    const activityData = [];

    try{
        const engData = await getEngravingData(engItemName);
        if(engData[0].eng_activity1 === '' || engData[0].eng_activity2 === '' || engData[0].eng_activity3 === '')
        {
            const apiStatus = await apiCheck();
            if(apiStatus === false) {
                return {
                    code: 500,
                    error: {
                        message: '로스트아크 서버에 연결할 수 없습니다.'
                    }
                };
            }

            const data = {
                ItemName: engData[0].eng_name,
                CategoryCode: engravingCategoryCode
            };
            
            const marketData = await axios.post(getMarketApi, data, {
                headers: global.token.lostarkHeader
            });
            const res: any = marketData.data;
            const itemId: string = res.Items[0].Id;

            const itemData = await axios.get(`${getMarketApi}/${itemId}`, {
                headers: global.token.lostarkHeader
            });

            const itemResponse: any = itemData.data;
            const itemTooltip = JSON.parse(itemResponse[0].ToolTip);
            const keySize = Object.keys(itemTooltip).length;

            let i = 0;
            for (const key in itemTooltip) {
                if(itemTooltip[key].type === 'ItemPartBox' && itemTooltip[key].value.Element_000.includes("효과보기"))
                {
                    const elementData = itemTooltip[key].value.Element_001.split('<BR>');
                    elementData.map(item => {
                        const data = item.replace(global.regex.htmlEntity, '').replace(/레벨 \d+ \(활성도 \d+\)/g, '').replace(' - ', '');
                        activityData.push(data);
                    });
                }
                i++;
            }

            const updateData = await updateEngravingData(activityData[0], activityData[1], activityData[2], engData[0].eng_name.replace(/\s/g, ""));

            if(updateData === null) {
                return {
                    code: 500,
                    error: {
                        message: '데이터 업데이트에 실패했습니다.'
                    }
                };
            } else{
                const reSearchData = await getEngravingData(engItemName);
                return returnEngravingData(reSearchData);
            }
        }
        else {
            return returnEngravingData(engData);
        }

    }
    catch(err) {
        console.error(err)
    }
}

// json 데이터 반환
const returnEngravingData = (engData) => {
    const data = engData[0];
    const message = `${data.eng_name}${data.eng_jobtype !== '' ? `(${data.eng_jobtype})` : ''}\n - 1레벨: ${data.eng_activity1}\n - 2레벨: ${data.eng_activity2}\n - 3레벨: ${data.eng_activity3}`;
    return {
        code: 200,
        message: message
    }
}

// 데이터 조회 
const getEngravingData = async (engname) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT eng_name, eng_type, eng_jobtype, eng_activity1, eng_activity2, eng_activity3 FROM LOA_LIBRARY_ENGRAVINGINFO WHERE (eng_shortname LIKE ? OR eng_indexname = ?) OR eng_jobtype LIKE ?';
        const selectValues = [`%${engname}%`, engname, `%${engname}%`];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 데이터 업데이트
const updateEngravingData = async (activity1, activity2, activity3, engname) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'UPDATE LOA_LIBRARY_ENGRAVINGINFO SET eng_activity1 = ?, eng_activity2 = ?, eng_activity3 = ? WHERE eng_indexname = ?';
        const selectValues = [activity1, activity2, activity3, `${engname}`];
        console.log(selectValues)
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

export default getAuctionEngravingData;