import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

async function getAuctionGems() {
    const apiStatus = await apiCheck();
    const apiUrl = `${global.apiUrl.lostark}auctions/items`;
    if(apiStatus === true) {
        const itemCategoryCode = 210000;
        const gemsList = ["1레벨 홍염의 보석", "2레벨 홍염의 보석", "3레벨 홍염의 보석", "4레벨 홍염의 보석" ,"5레벨 홍염의 보석", "6레벨 홍염의 보석", "7레벨 홍염의 보석", "8레벨 홍염의 보석", "9레벨 홍염의 보석", "10레벨 홍염의 보석", "1레벨 멸화의 보석", "2레벨 멸화의 보석", "3레벨 멸화의 보석", "4레벨 멸화의 보석", "5레벨 멸화의 보석", "6레벨 멸화의 보석", "7레벨 멸화의 보석", "8레벨 멸화의 보석", "9레벨 멸화의 보석", "10레벨 멸화의 보석"];
        
    }
}