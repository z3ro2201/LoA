import axios from 'axios'
import global from '../../config/config'

async function getCharacterCardText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcards`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const card = response.data.ArmoryCard;

        // 착용중인 카드정보
        const cardsArr = [];
        for(const tmp of card.Cards) {
            cardsArr.push(`[${tmp.Grade}] ${tmp.Name} (각성 ${tmp.AwakeCount}/${tmp.AwakeTotal})`);
        }

        // 활성화된 세트효과
        const cardEffectArr = [];
        for(const tmp of card.Effects[0].Items) {
            cardEffectArr.push(`${tmp.Name}  ${tmp.Description}`);
        }

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;
        const cardList = (cardsArr.length > 0) ? `${cardsArr.join('\n')}` : '장착중인 카드가 없습니다.';
        const cardEffect = (cardEffectArr.length > 0) ? `\n[세트효과]\n${cardEffectArr.join('\n')}` : '발동 된 세트효과가 없습니다.';
        const characterData = `[${profile.CharacterClassName}]\n${characterTitle} ${profile.CharacterName}\n\n[카드목록]\n${cardList}\n\n[세트효과]\n${cardEffect}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterCardText;