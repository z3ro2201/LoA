import express, { Router, Request, Response } from 'express';
import raidAuction from '../functions/utils/raidAuction';

const utilRouter: Router = express.Router();
// 레이드 경매
utilRouter.get('/raidAuction/:players/:gold', (req: Request, res: Response) => {
    const players:number = req.params.players;
    const gold:number = req.params.gold;
    console.log(isNaN(players))
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
    const raidRewardMessage = raidAuction(players, gold);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

export default utilRouter;