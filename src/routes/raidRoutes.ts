import express, { Router, Request, Response } from 'express';

// 각종 명령어 목록
import raidReward, {
    raidRewardOreha,raidRewardAreugoseu,raidRewardBaltanNormal,raidRewardBaltanHard,
    raidRewardBiackissNormal,raidRewardBiackissHard,raidRewardKoukuSaton,raidRewardAbrelshudNormal,
    raidRewardAbrelshudHard,raidRewardIlliakanNormal,raidRewardIlliakanHard,raidRewardKayanggelNormal,
    raidRewardKayanggelHard,raidRewardSangatapNormal,raidRewardSangatapHard
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
    const raidRewardMessage = raidRewardBaltanNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 발탄(하드) 보상
raidRouter.get('/Baltan/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardBaltanHard();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});


// 비아(노말) 보상
raidRouter.get('/Biackiss/Normal', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardBiackissNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 비아(하드) 보상
raidRouter.get('/Biackiss/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardBiackissHard();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 쿠크세이튼 보상
raidRouter.get('/KoukuSaton', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardKoukuSaton();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 아브(노말) 보상
raidRouter.get('/Abrelshud/Normal', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardAbrelshudNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 아브(하드) 보상
raidRouter.get('/Abrelshud/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardAbrelshudHard();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 일리아칸(노말) 보상
raidRouter.get('/Illiakan/Normal', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardIlliakanNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 일리아칸(하드) 보상
raidRouter.get('/Illiakan/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardIlliakanHard();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카양겔(노말) 보상
raidRouter.get('/Kayanggel/Normal', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardKayanggelNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 카양겔(하드) 보상
raidRouter.get('/Kayanggel/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardKayanggelHard();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 상아탑(노말) 보상
raidRouter.get('/Sangatap/Normal', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardSangatapNormal();
    res.status(200).json({
        code: 200,
        message: raidRewardMessage
    });
});

// 상아탑(하드) 보상
raidRouter.get('/Sangatap/Hard', (req: Request, res: Response) => {
    const raidRewardMessage = raidRewardSangatapHard();
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