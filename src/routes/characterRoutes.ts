import express, { Router, Request, Response } from 'express';
import axios from 'axios'
import global from '../config/config'

// 각종 명령어 목록
import getCharacterInfoJson from '../functions/character/getCharacterInfoJson'
import getCharacterInfoText from '../functions/character/getCharacterInfoText'
import getSubCharacterInfoText from '../functions/character/getSubCharacterInfoText'
import getCharacterAvatarText from '../functions/character/getCharacterAvatarText'
import getEquipmentText from '../functions/character/getEquipmentText'
import getEquipmentJson from '../functions/character/getEquipmentJson'
import getAccessoryText from '../functions/character/getCharacterAccessoryText'
import getCharacterAccessoryJson from '../functions/character/getCharacterAccessoryJson'
import getCharacterGemText from '../functions/character/getCharacterGemText'
import getCharacterSkillText from '../functions/character/getCharacterSkills'
import getCharacterCardText from '../functions/character/getCharacterCardText'
import getCharacterCollectText from '../functions/character/getCharacterCollect'
import weeklySupplyGold from '../functions/character/getWeeklySupplyGold'
import { getCharacterSuspendAccount } from '../functions/character/getCharacterSuspendAccount';
import getCharacterEngravingText from '../functions/character/getCharacterEngravingText'
import getAllServerSubCharacterInfoText from 'functions/character/getAllServerSubCharacterInfoText';

const characterRouter: Router = express.Router();

// GET /character 경로에 대한 핸들러
characterRouter.get('/', (req: Request, res: Response) => {
    res.status(403).json({
        error: {
            code: 403,
            message: "잘못된 접근입니다."
        }
    })
});

characterRouter.get('/:characterName', (req: Request, res: Response) => {
    res.status(400).json({
        error: {
            code: 400,
            message: '상세 기능 코드를 넣어주세요.'
        }
    })
});

// 캐릭터 정보
characterRouter.get('/:characterName/info/json', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterInfoJson(characterName);
        res.status(200).json({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

characterRouter.get('/:characterName/info', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterInfoText(characterName);
        res.status(200).send(characterData)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                code: 500,
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 부캐 정보 가져오기
characterRouter.get('/:characterName/subCharacterList', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getSubCharacterInfoText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 아바타 정보 가져오기
characterRouter.get('/:characterName/avatar', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterAvatarText(characterName);
        const htmlTag = `<!doctype html><html lang="ko"><head>
        <meta property="og:type" content="website"><meta property="og:url" content="https://loaapi.2er0.io/character/${characterName}/avatar"><meta property="og:title" content="${characterName}님의 아바타">
        <meta property="og:image" content="${characterData[0].AvataUrl}"><meta property="og:description" content="${characterName}님의 아바타"><meta property="og:image:width" content="568">
        <meta property="og:image:height" content="658"><meta charset="utf-8"><title>${characterName}님의 아바타 정보 입니다.</title></head><body><img src="${characterData[0].AvataUrl}"></body></html>`;
        res.status(200).send(htmlTag)
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 장비정보
characterRouter.get('/:characterName/equipment', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getEquipmentText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

characterRouter.get('/:characterName/equipment/json', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getEquipmentJson(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 악세정보
characterRouter.get('/:characterName/accessory', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getAccessoryText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

characterRouter.get('/:characterName/accessory/json', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterAccessoryJson(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 보석정보
characterRouter.get('/:characterName/gem', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterGemText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 스킬정보
characterRouter.get('/:characterName/skills', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterSkillText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 카드정보
characterRouter.get('/:characterName/cards', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterCardText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 내실정보
characterRouter.get('/:characterName/collects', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterCollectText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});
characterRouter.get('/:characterName/collects/:collectType', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    const collectType = req.params.collectType;
    try {
        const characterData = await getCharacterCollectText(characterName, collectType);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 주간골드수급정보
characterRouter.get('/:characterName/rice', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await weeklySupplyGold(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 정지캐릭터 정보 가져오기
characterRouter.get('/:characterName/suspend', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterSuspendAccount(characterName, 1);
        console.log(characterData)
        res.status(200).send({
            code: characterData,
            message: (characterData === 200) ? '정지된 계정입니다.' : (characterData === 404) ? '생성되지 않았거나 삭제된 계정입니다.' : '정상 계정입니다.'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 각인정보
characterRouter.get('/:characterName/engravings', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getCharacterEngravingText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});

// 모든부캐 정보 가져오기
characterRouter.get('/:characterName/allServerSubCharacterList', async (req: Request, res: Response) => {
    const characterName = req.params.characterName;
    try {
        const characterData = await getAllServerSubCharacterInfoText(characterName);
        res.status(200).send({
            code: 200,
            message: '정상적으로 처리되었습니다.',
            characterData: characterData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: {
                message: "처리과정에 문제가 발생하였습니다."
            }
        })
    }
});
export default characterRouter