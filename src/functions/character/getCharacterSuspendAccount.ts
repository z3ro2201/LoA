import axios from 'axios'
import Cheerio from 'cheerio'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'

export const getCharacterSuspendAccount = async (characterName : string) => {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    const lostarkHomeUrl = `https://lostark.game.onstove.com/Profile/Character/${characterName}`;

    const apiStatus = await apiCheck();
    if(apiStatus === true) {
        try {
            const response = await axios.get(apiUrl, {
                headers: global.token.lostarkHeader
            });
            
            // openapi 상태
            const openapiAccountSta = response.data;

            // 전투정보실 상태
            const htmlResponse = await axios.get(lostarkHomeUrl);
            const $ = Cheerio.load(htmlResponse.data);
            const isDiv = $('div.profile-attention').length > 0;
            
            if(isDiv && openapiAccountSta) { // 둘 다 있으니 정지된 계정으로 판단 (만약 정상계정이면 isDiv는 0이 되어야 함.)
                return 200;
            }
            else if(!isDiv && openapiAccountSta) { // 전투정보실에 attention 은 없고 openapi 데이터가 있는경우 정상계정으로 판단
                return 204;
            } else { // 둘다 없으면 삭제되거나 없는 계정으로 판단
                return 404;
            }
        } catch (e) {
            throw e;
        }
    }
        
}