import express, { Router, Request, Response } from 'express';

// 각종 명령어 목록
import raidReward, { raidName } from '../functions/raid/raidReward'
import {raidGameList, raidGameStrategy} from '../functions/raid/raidGameStrategy'

const raidRouter: Router = express.Router();

// 안내메시지
raidRouter.get('/reward/', (req: Request, res: Response) => {
    const helpMessage = raidReward();
    res.status(200).json({
        code: 200,
        message: helpMessage
    });
});

raidRouter.get('/reward/:raidNameStr/:isGold?', async (req: Request, res: Response) => {
    const raidValue = req.params.raidNameStr;
    const goldValue = req.params.isGold || 0;
    const RaidData = await raidName(raidValue, goldValue);
    res.status(200).json({
        code: 200,
        message: RaidData
    });
});

// 레이드 컨닝페이퍼
raidRouter.get('/GameStrategy/', async (req: Request, res: Response) => {
    const RaidData = await raidGameList();
    res.status(200).json({
        code: 200,
        message: RaidData
    });
});

// 레이드 컨닝페이퍼
raidRouter.get('/GameStrategy/:raidNameStr', async (req: Request, res: Response) => {
    const raidValue = req.params.raidNameStr;
    const RaidData = await raidGameStrategy(raidValue);
    res.status(200).json({
        code: 200,
        message: RaidData
    });
});


export default raidRouter;