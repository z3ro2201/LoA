import axios from 'axios'
import global from '../../config/config'

interface CharacterInfo {
    Name: string;
    Level: number;
    CharacterImage: string;
    Title: string;
    GuildName: string;
    GuildMemberGrade: string;
    SkillPoint: string;
    Stats: object;
    ItemAvgLevel: string;
    ItemMaxLevel: string;
    Equiment: object;
    Accessory: object;
    Avatar: object;
    Skills: object
    Collectibles: object;
    Engravings: object;
    Effects: object;
}
async function getCharacterInfoJson(characterName: string): Promise<CharacterInfo> {
    const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });

        const profile = response.data.ArmoryProfile;
        const equipment = response.data.ArmoryEquipment;
        const avatars = response.data.ArmoryAvatars;
        const skills = response.data.ArmorySkills;
        const collect = response.data.Collectibles;
        const engraving = response.data.ArmoryEngraving;

        // 스탯정보
        const statsArr = [];
        for(const tmp of profile.Stats) {
            const toolTips = tmp.Tooltip.join('\n').replace(global.regex.htmlEntity, '').replace('  ', '').split('\n');
            const tmpData = {
                Type: tmp.Type,
                Value: tmp.Value,
                Tooltip: toolTips
            }
            statsArr.push(tmpData);
        }

        // 장비정보
        const equipmentArr = [];
        let i:number = 0;
        for(const tmp of equipment) {
            if(i > 5) break;
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const tmpData = {
                Icon: tmp.Icon,
                Type: tmp.Type,
                Name: tmp.Name.replace(/[^가-힣]/g, ''),
                Level: tmp.Name.replace(/\D/g, ''),
                Grade: tmp.Grade,
                Tooltip: JSON.parse(toolTips)
            }
            equipmentArr.push(tmpData);
            i++;
        }

        // 악세정보
        const accessoryArr = [];
        i = 0;
        for(const tmp of equipment) {
            if(i > 5 && i < 13) {
                const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
                const tmpData = {
                    Icon: tmp.Icon,
                    Type: tmp.Type,
                    Name: tmp.Name.replace(/[^가-힣]/g, ''),
                    Level: tmp.Name.replace(/\D/g, ''),
                    Grade: tmp.Grade,
                    Tooltip: JSON.parse(toolTips)
                }
                accessoryArr.push(tmpData);
            }
            i++;
        }

        // 아바타정보
        const avatarArr = [];
        for(const tmp of avatars) {
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const tmpData = {
                Type: tmp.Type,
                Name: tmp.Name,
                Icon: tmp.Icon,
                Grade: tmp.Grade,
                IsSet: tmp.IsSet,
                IsInner: tmp.IsInner,
                Tooltip: JSON.parse(toolTips)
            }
            avatarArr.push(tmpData);
        }

        // 스킬 정보
        const skillsArr = [];
        for(const tmp of skills) {
            const tripodsArr = [];
            for(const tmpTripod of tmp.Tripods) {
                const toolTips = tmpTripod.Tooltip.replace(global.regex.htmlEntity, '');
                const tmpTripods = {
                    Tier: tmpTripod.Tier,
                    Slot: tmpTripod.Slot,
                    Name: tmpTripod.Name,
                    Icon: tmpTripod.Icon,
                    Level: tmpTripod.Level,
                    IsSelected: tmpTripod.IsSelected,
                    Tooltip: toolTips
                }
                tripodsArr.push(tmpTripods);
            }
            const skillsTooltips = tmp.Tooltip.replace(global.regex.htmlEntity, '');
            const tmpData = {
                Type: tmp.Type,
                Name: tmp.Name,
                Icon: tmp.Icon,
                IsAwakening: tmp.Grade,
                Tripods: tripodsArr.length > 0 ? tripodsArr : null,
                Rune: tmp.Rune === null ? null : {
                    Name: tmp.Rune.Name,
                    Icon: tmp.Rune.Icon,
                    Grade: tmp.Rune.Grade,
                    Tooltip: JSON.parse(tmp.Rune.Tooltip.replace(global.regex.htmlEntity, ''))
                },
                Tooltip: skillsTooltips.length > 0 ? JSON.parse(skillsTooltips) : null
            }
            skillsArr.push(tmpData);
        }

        // 슬롯각인정보
        const engravingsArr = [];
        for(const tmp of engraving.Engravings){
            const toolTips = tmp.Tooltip.replace(global.regex.htmlEntity, '\\n');
            const tmpData = {
                Slot: tmp.Slot,
                Name: tmp.Name,
                Icon: tmp.Icon,
                Tooltip: toolTips.length > 0 ? JSON.parse(toolTips) : null
            }
            engravingsArr.push(tmpData);
        }
        // 활성각인정보
        const effectArr = [];
        for(const tmp of engraving.Effects){
            const tmpData = {
                Icon: tmp.Icon,
                Name: tmp.Name,
                Description: tmp.Description,
            }
            effectArr.push(tmpData);
        }



        // 서버 응답을 파싱하여 캐릭터 정보를 추출
        const characterData: CharacterInfo = {
            CharacterImage: response.data.ArmoryProfile.CharacterImage,
            Title: (profile.Title === null) ? '없음' : profile.Title,
            Name: profile.CharacterName,
            Level: profile.CharacterLevel,
            GuildName: profile.GuildName,
            GuildMemberGrade: profile.GuildMemberGrade,
            SkillPoint: profile.UsingSkillPoint + '/' + profile.TotalSkillPoint,
            ItemAvgLevel: profile.ItemAvgLevel,
            ItemMaxLevel: profile.ItemMaxLevel,
            Stats: statsArr,
            Equiment: equipmentArr,
            Accessory: accessoryArr,
            Avatar: avatarArr,
            Skills: skillsArr,
            Collectibles: collect,
            Engravings: engravingsArr,
            Effects: effectArr
        };
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getCharacterInfoJson;