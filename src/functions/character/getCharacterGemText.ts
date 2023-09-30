import axios from 'axios'
import global from '../../config/config'

async function getCharacterGemText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bgems`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const gems = response.data.ArmoryGem;

        // 보석정보
        const gemsArr = [];
        let i:number = 0;
        for(const tmp of gems.Gems) {
            if(i > 5) break;
            const cleanedToolTipString = tmp.Tooltip.replace(/<[^>]+>/g, '').replace(/\\n/g, '');
            const tooltipObject = JSON.parse(cleanedToolTipString);
            let toolTipText = '';
            for(const tmpData in tooltipObject) {
                if(tooltipObject.hasOwnProperty(tmpData)) {
                    const element = tooltipObject[tmpData];
                    if(element && element.value && element.value.Element_000 && element.value.Element_000 === '효과') {
                        toolTipText = `: ${element.value.Element_001}`;
                    }
                }
            }
            const tmpData = `${tmp.Name.replace(global.regex.htmlEntity, '').replace(/(\d+)레벨 (.+)의 보석/, 'Lv.$1 $2')}${toolTipText}\n`;
            gemsArr.push(tmpData);
            i++;
        }

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;     
        const characterData = `[${profile.CharacterClassName}]\n${characterTitle} ${profile.CharacterName}\n\n
        [보석정보]\n${gemsArr.join('\n')}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterGemText;