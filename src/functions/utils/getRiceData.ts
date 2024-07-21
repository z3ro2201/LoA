import axios from 'axios';
import global from '../../config/config'

// 파괴석결정, 수호석결정, 위대한 명예의 돌파석, 파괴강석, 수호강석, 찬란한 명예의 돌파석, 정제된 파괴강석, 정제된 수호강석, 경이로운 명예의 돌파석, 오레하 융화 재료 ,상급 오레하 융화 재료 ,최상급 오레하 융화 재료 ,명파주머니 (소), 명파주머니 (중), 명파주머니 (대), 운명의 수호석, 운명의 파괴석, 운명의 돌파석, 아비도스 융화 재료, 운명의 파편 주머니 (소), 에스더의 기운
const riceListArr = [66102003, 66102103, 66110222, 66102004, 66110224, 66102104, 66110221, 66102005, 66102105, 66110223, 6861008, 6861009, 6861011, 66130131, 66130132, 66130133, 66102106, 66102006, 66110225, 6861012, 66130141, 66150010]

interface riceList {
    Name: string
}

export const getRiceData = async () => {

    try {
        const apiUrl = `${global.apiUrl.lostark}markets/items/`;
        const requests = riceListArr.map(itemId =>
            axios.get(`${apiUrl}${itemId}`, {
              headers: global.token.lostarkHeader
            })
          );
      
          const responses = await Promise.all(requests);
      
          const list = responses.map(response => ({
            itemName: response.data[0].Name,
            itemPrice: response.data[0].Stats[0].AvgPrice
          }));
          

          return `[쌀값]\n${list.map(item => `${item.itemName}: ${item.itemPrice}`).join('\n')}`;

    }
    catch(e) {
        console.error(e)
        return 'error'
    }
}