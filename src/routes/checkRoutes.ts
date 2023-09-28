import express, { Router, Request, Response } from 'express';

// 각종 명령어 목록
import getLostarkServerStatus from '../functions/check/getLostarkServerStatus'

const checkRouter: Router = express.Router();

// GET /character 경로에 대한 핸들러
checkRouter.get('/', (req: Request, res: Response) => {
    res.status(403).json({
        code: 403,
        error: {
            message: "잘못된 접근입니다."
        }
    })
});

checkRouter.get('/getLostarkServerStatus', async (req: Request, res: Response) => {
    try {
        const serverStatus = await getLostarkServerStatus();
        res.status(200).json({
            code: 200,
            message: serverStatus
        })
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

export default checkRouter;