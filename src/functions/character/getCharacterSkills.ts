import axios from 'axios'
import global from '../../config/config'

async function getCharacterSkillText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcombat-skills`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const skils = response.data.ArmorySkills;

        // 보석정보
        const skilsArr = [];
        for(var tmp of skils) {
            if(tmp.Level > 1 || tmp.IsAwakening === true) {
                const tripodsArr = [];
                if(tmp.Tripods !== null) {
                    const tmpTripods = [];
                    for(const TripodsTmp of tmp.Tripods) {
                        if(TripodsTmp.IsSelected === true) {
                            tmpTripods.push(`[${parseInt(TripodsTmp.Tier+1)} 티어] Lv ${TripodsTmp.Level}. ${TripodsTmp.Name}`);
                        }
                    }
                    if(tmpTripods.length > 0) tripodsArr.push(tmpTripods.join('\n'));
                }
                const isAwakening:string = (tmp.IsAwakening === true)?'[각성기]' : '';
                const runeData = (tmp.Rune !== null) ? `(룬: ${tmp.Rune.Name}[${tmp.Rune.Grade}])` : ``;
                const tripods = (tripodsArr.length > 0) ? `<트라이포드>\n${tripodsArr.join('\n')}` : '';
                const tmpData = `${isAwakening}Lv.${tmp.Level} ${tmp.Name.replace(global.regex.htmlEntity, '')} ${runeData}${tripods}`;
                skilsArr.push(tmpData + '\n');
            }
        }

        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterTitle = (profile.Title === null) ? '' : `${profile.Title}`;     
        const characterData = `${skilsArr.join('\n')}\n * 각성 스킬은 활성화 여부를 알 수 없어 기본적으로 모두 출력됩니다.`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterSkillText;