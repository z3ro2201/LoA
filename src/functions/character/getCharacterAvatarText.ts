import axios from 'axios'
import global from '../../config/config'

export const command: Record<string, string>= {
    command: global.prefix + '아바타',
    help: '[캐릭터이름]',
    description: '캐릭터 아바타를 링크를 통해 볼 수 있습니다.'
}

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