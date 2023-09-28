import axios from 'axios'
import global from '../../config/config'

async function getCharacterAvatarText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;

        const characterData = `[${profile.ServerName}] ${characterName}\n아바타 링크: ${profile.CharacterImage}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterAvatarText;