import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

export const command: Record<string, string>= {
    command: global.prefix + '시세',
    help: '',
    description: '시세 정보를 볼 수 있습니다.'
}

async function getMarketPriceText() {
    const apiStatus = await apiCheck();
    //const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;
    if(apiStatus === true) {
    } else {}
}