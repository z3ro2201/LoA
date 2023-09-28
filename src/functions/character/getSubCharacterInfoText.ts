import axios from 'axios'
import global from '../../config/config'

async function getSubCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}characters/${characterName}/siblings`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const data = response.data;

        // 캐릭터목록
        const characterServer = data.filter(characterData => characterData.CharacterName === characterName);
        const characterListArr = [];
        for(const tmp of data) {
            if(characterServer[0].ServerName === tmp.ServerName)
                characterListArr.push(`[${tmp.CharacterClassName}] Lv ${tmp.CharacterClassName.toString().padStart(2, '0')}  ${tmp.CharacterName}  (${tmp.ItemAvgLevel})`)
        }

        const characterData = `[${characterServer[0].ServerName}] ${characterName}\n${characterListArr.join('\n')}\n\n총 ${characterListArr.length}개의 캐릭터 보유`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getSubCharacterInfoText;