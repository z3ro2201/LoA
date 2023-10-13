import express, { Router, Request, Response } from 'express';

// 각종 명령어 목록
import raidReward, { raidName } from '../functions/raid/raidReward'

const raidRouter: Router = express.Router();

// 안내메시지
raidRouter.get('/', (req: Request, res: Response) => {
    const helpMessage = raidReward();
    res.status(200).json({
        code: 200,
        message: helpMessage
    });
    console.log(raidReward)
});

raidRouter.get('/:raidNameStr/:isGold?', async (req: Request, res: Response) => {
    const raidValue = req.params.raidNameStr;
    const goldValue = req.params.isGold || 0;
    const RaidData = await raidName(raidValue, goldValue);
    res.status(200).json({
        code: 200,
        message: RaidData
    });
});


export default raidRouter;