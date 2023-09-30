import axios from 'axios'
import global from '../../config/config'

export const command: Record<string, string>= {
    command: global.prefix + '캐릭터',
    help: '[캐릭터이름]',
    description: '캐릭터 정보를 볼 수 있습니다.'
}

async function getCharacterInfoText(characterName: string) {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const engraving = response.data.ArmoryEngraving;

        // 스탯정보
        const statsArr = [];
        let i:number = 0;
        for(var tmp of profile.Stats) {
            if(i > 5) break;
            const tmpData = `${tmp.Type}: ${tmp.Value}`;
            statsArr.push(tmpData);
            i++;
        }



        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterTitle = (profile.Title === null) ? '' : `${profile.Title} `;
        const guildName = (profile.GuildName === null) ? '미가입' : profile.GuildName;
        let engravingText = '';
        let statsText = (statsArr.length > 0) ? `[특성정보]\n${statsArr.join(', ')}` : '';
        if(engraving.Engravings !== null) {
            const engravingSlots = [];
            for(let tmp of engraving.Engravings) {
                // 장착각인 활성포인트를 위해 tooltip 파싱
                const toolTips = JSON.parse(tmp.Tooltip);
                const activatedLevel = toolTips.Element_001.value.leftText.replace(/[가-힣]/g, '').replace(global.regex.htmlEntity, '').trim();
                engravingSlots.push(`${tmp.Name} ${activatedLevel}`);
            }
            if(engravingSlots.length > 0) {
                engravingText = `[장착 각인] ${engravingSlots.join(', ')}\n`;
            }
        }
        if(engraving.Effects !== null) {
            const engravingEffect = [];
            for(let tmp of engraving.Effects) {
                engravingEffect.push(tmp.Name.replace(' Lv.', ''));
            }
            if(engravingEffect.length > 0) {
                engravingText += `[활성된 각인] ${engravingEffect.join(', ')}\n`;
            }
        }
        engravingText = (engravingText !== '') ? `[각인정보]\n${engravingText}\n` : '';

        const characterData = `[${profile.CharacterClassName}]\n${characterTitle}${profile.CharacterName}\n\n` +
                              `[캐릭터 기본정보]\n` +
                              `템/전/원      ${profile.ItemAvgLevel}/${profile.CharacterLevel}/${profile.ExpeditionLevel}\n` +
                              `서버/길드     ${profile.ServerName}/${guildName}\n` +
                              `체력/공격력    ${profile.Stats[6].Value}/${profile.Stats[7].Value}\n` +
                              `스킬포인트     ${profile.UsingSkillPoint}/${profile.TotalSkillPoint}\n\n` +
                              `${engravingText}` +
                              `${statsText}`;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterInfoText;