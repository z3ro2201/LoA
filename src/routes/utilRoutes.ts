import express, { Router, Request, Response } from 'express';
import {raidAuction, raidAuctionIncludePlayer} from '../functions/utils/raidAuction';
import {getEmoticon} from '../functions/utils/loaEmoticon';
import getAuctionGems from '../functions/utils/getAuctionGems';
import getAuctionGemsChartJsonData from '../functions/utils/getAuctionGemsChartJsonData';
import auctionGemChart from '../functions/utils/auctionGemsChart';
import getAuctionEngravingData from '../functions/utils/getEngravingInfo'

const utilRouter: Router = express.Router();

// 레이드 경매 입찰가 계산
utilRouter.get('/raidAuction/:gold', (req: Request, res: Response) => {
    const gold:number = req.params.gold;
    if(isNaN(gold) === true) {
        return res.status(400).json({
            code: 400,
            message: '숫자값만 입력이 가능합니다'
        })
    }
    else if(gold === undefined) {
        return res.status(400).json({
            code: 400,
            message: '경매 입찰가를 적어주십시요.'
        })
    }
    const raidRewardMessage = raidAuction(gold);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 레이드 경매
utilRouter.get('/raidAuction/:gold/:players', (req: Request, res: Response) => {
    const players:number = req.params.players;
    const gold:number = req.params.gold;
    if(isNaN(players) === true || isNaN(gold) === true) {
        return res.status(400).json({
            code: 400,
            message: '숫자값만 입력이 가능합니다'
        })
    }
    else if(players === undefined || (players > 16 || players < 2)) {
        return res.status(400).json({
            code: 400,
            message: '최소 본인 포함 2인 이상, 최대 16인 이하의 값을 입력하십시요.'
        })
    }
    else if(gold === undefined) {
        return res.status(400).json({
            code: 400,
            message: '경매 입찰가를 적어주십시요.'
        })
    }
    const raidRewardMessage = raidAuctionIncludePlayer(gold, players);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});


// 로아콘
utilRouter.get('/emoticon/:loaconName', async (req: Request, res: Response) => {
    const loaconName:string = req.params.loaconName;
    try {
        const emoticonData = await getEmoticon(loaconName);
        console.log(emoticonData);
        if(emoticonData === 204) {
            res.status(404).json({
                code: 204,
                error: {
                    message: "없는 이모티콘 입니다."
                }
            })
        } else {
            const htmlTag = `<!doctype html><html lang="ko"><head>
            <meta property="og:type" content="website"><meta property="og:url" content="https://loaapi.2er0.io/util/emoticon/${loaconName}"><meta property="og:title" content="[${loaconName}]">
            <meta property="og:image" content="${emoticonData.EMO_URL}"><meta property="og:description" content="[${loaconName} 로아콘]"><meta property="og:image:width" content="568">
            <meta property="og:image:height" content="658"><meta charset="utf-8"><title>${loaconName} 로아콘</title></head><body><img src="${emoticonData.EMO_URL}"></body></html>`;
            res.status(200).send(htmlTag);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 보석정보
utilRouter.get('/gemstone/:gemstoneName', async (req: Request, res: Response) => {
    const gemstoneName:string = req.params.gemstoneName;
    try {
        const gemstoneData = await getAuctionGems(gemstoneName);
        res.status(200).json(gemstoneData);

    } catch (error) {
        console.error(error)
    }
});

// 보석차트 JSON데이터
utilRouter.get('/getGemstoneChartData/:gemstoneName', async (req: Request, res: Response)=>{
    const gemstoneName:string = req.params.gemstoneName;
    try{
        const gemstoneData = await getAuctionGemsChartJsonData(gemstoneName);
        res.status(200).json(gemstoneData)
    }catch(error){
        console.error(error)
    }
})

utilRouter.get('/getGemstoneChartData/:gemstoneName/:gemstoneSyncTime', async (req: Request, res: Response)=>{
    const gemstoneName:string = req.params.gemstoneName;
    const gemstoneTime:string = req.params.gemstoneSyncTime;
    try{
        const gemstoneData = await getAuctionGemsChartJsonData(gemstoneName, gemstoneTime);
        res.status(200).json(gemstoneData)
    }catch(error){
        console.error(error)
    }
})

utilRouter.get('/gemstoneChart/:gemstoneName', async (req: Request, res: Response)=>{
    const gemstoneName:string = req.params.gemstoneName;
    const html = auctionGemChart(gemstoneName);
    res.status(200).send(html);
})

// 각인정보
utilRouter.get('/getEngravingData/:engravingName', async (req: Request, res: Response) => {
    const engravingName:string = req.params.engravingName;
    const engravingData = await getAuctionEngravingData(engravingName);
    res.status(200).json(engravingData);
})

export default utilRouter;