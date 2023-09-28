import dotenv from 'dotenv'
dotenv.config();
const global = {
    serverList: ['루페온', '실리안', '아만', '아브렐슈드', '카단', '카마인', '카제로스', '니나브'],
    token: {
        lostarkHeader: {
            authorization: 'bearer ' + process.env.LOSTARK_OPENAPI_KEY ,
            accept: 'application/json'
        }
    },
    apiUrl: {
        onstove: 'https://maintenance.onstove.com/',
        lostark: 'https://developer-lostark.game.onstove.com/',
        lostarkApi: 'https://lostarkapi.xyz/',
        kloaApi: 'https://api.korlark.com/merchants?limit=15&server='
    },
    regex: {
        htmlEntity: /<[^>]*>/g,
        bracketEntity: /\[[^\]]*\]/g
    },
    insideQuest: [
        { type: '모코코 씨앗', name: '모코코', count: 0 },
        { type: '섬의 마음', name: '섬마', count: 0 },
        { type: '위대한 미술품', name: '미술품', count: 0 },
        { type: '거인의 심장', name: '거심', count: 0 },
        { type: '이그네아의 징표', name: '이그네아', count: 0 },
        { type: '항해 모험물', name: '항해', count: 0 },
        { type: '세계수의 잎', name: '세계수', count: 0 },
        { type: '오르페우스의 별', name: '오페별', count: 0 },
        { type: '기억의 오르골', name: '오르골', count: 0 },
    ],

}

export default global;