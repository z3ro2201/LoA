import axios from 'axios'
import global from '../../config/config'

async function getCharacterCollectText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcollectibles`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const collects = response.data.Collectibles;

        // 착용중인 카드정보
        const collectsArr = [];
        for(const tmp of collects) {
            collectsArr.push(`${tmp.Type}: ${tmp.Point}`);
        }

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;
        const characterData = `[${profile.CharacterClassName}]\n${characterTitle} ${profile.CharacterName}\n\n[내실목록]\n${collectsArr.join(', ')}\n\n자세하게 보고 싶으시면 내실명령어에 옵션을 붙여보세요!`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterCollectText;