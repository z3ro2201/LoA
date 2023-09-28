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
import getCharacterGemText from '../functions/character/getCharacterGemText'
import getCharacterSkillText from '../functions/character/getCharacterSkills'
import getCharacterCardText from '../functions/character/getCharacterCardText'

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


export default characterRouter