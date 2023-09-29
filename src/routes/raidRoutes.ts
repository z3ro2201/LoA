import express, { Router, Request, Response } from 'express';

// 각종 명령어 목록
import raidReward, {
    raidRewardOreha,raidRewardAreugoseu,raidRewardBaltanNormal,raidRewardBaltanHard,
    raidRewardBiackissNormal,raidRewardBiackissHard,raidRewardKoukuSaton,raidRewardAbrelshudNormal,
    raidRewardAbrelshudHard,raidRewardIlliakanNormal,raidRewardIlliakanHard,raidRewardKayanggelNormal,
    raidRewardKayanggelHard,raidRewardSangatapNormal,raidRewardSangatapHard,raidRewardKarmenNormal,raidRewardKarmenHard
} from '../functions/raid/raidReward'

const raidRouter: Router = express.Router();

// 오레하 보상
raidRouter.get('/Oreha', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardOreha();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 아르고스 보상
raidRouter.get('/Areugoseu', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardAreugoseu();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 발탄(노말) 보상
raidRouter.get('/Baltan/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardBaltanNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 발탄(하드) 보상
raidRouter.get('/Baltan/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardBaltanHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});


// 비아(노말) 보상
raidRouter.get('/Biackiss/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardBiackissNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 비아(하드) 보상
raidRouter.get('/Biackiss/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardBiackissHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 쿠크세이튼 보상
raidRouter.get('/KoukuSaton', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardKoukuSaton(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 아브(노말) 보상
raidRouter.get('/Abrelshud/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardAbrelshudNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 아브(하드) 보상
raidRouter.get('/Abrelshud/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardAbrelshudHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 일리아칸(노말) 보상
raidRouter.get('/Illiakan/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardIlliakanNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 일리아칸(하드) 보상
raidRouter.get('/Illiakan/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardIlliakanHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카양겔(노말) 보상
raidRouter.get('/Kayanggel/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardKayanggelNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카양겔(하드) 보상
raidRouter.get('/Kayanggel/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardKayanggelHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 상아탑(노말) 보상
raidRouter.get('/Sangatap/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardSangatapNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 상아탑(하드) 보상
raidRouter.get('/Sangatap/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardSangatapHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카멘(노말) 보상
raidRouter.get('/Karmen/Normal', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardKarmenNormal(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카멘(하드) 보상
raidRouter.get('/Karmen/Hard', (req: Request, res: Response) => {
    const queryStr:string = req.query.gold;
    const raidRewardMessage = raidRewardKarmenHard(queryStr);
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 안내메시지
raidRouter.get('/', (req: Request, res: Response) => {
    const raidRewardMessage = raidReward();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

export default raidRouter;