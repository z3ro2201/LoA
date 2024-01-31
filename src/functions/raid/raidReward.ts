import axios from 'axios'
import global from '../../config/config'
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

const command: Record<string, string>= {
    command: global.prefix + '보상(ㅂㅅ)',
    help: '[오레하|아르고스|발탄노말|발탄하드|비아노말|비아하드|쿠크|아브노말|아브하드|일리노말|일리하드|카양겔노말|카양겔하드|상아탑노말|상아탑하드|카멘노말|카멘하드]\n(재료를 보려면 뒤에 "더보기" 추가하세요. 초성가능. 발비, 발하, 상하탑, 상노탑 가능)',
    description: '레이드 보상을 볼 수 있습니다.'
}

export const raidName = async (str: string, goldOptions: string) => {
    const rewardRaidName = changeRaidName(str);
    if (rewardRaidName !== 0) {
        const rewards = await queryRaids(rewardRaidName);
        const title = `[${rewardRaidName.name}${rewardRaidName.diff ? `(${rewardRaidName.diff})` : ''} 보상]\n`;
        const rewardArr = [];
        const rewardLength = rewards.length;
        let totalGold:number = 0;
        let bonusGold:number = 0;
        if (parseInt(goldOptions) === 1) {
            console.log(goldOptions);
            for (const reward of rewards) {
                const diffTitle = (rewardLength > 1) ? `[${reward.raid_phase}관문] 입장레벨: ${reward.raid_minItemLevel}${reward.raid_maxItemLevel ? `, 골드획득불가: ${reward.raid_maxItemLevel}\n` : '\n'}` : '';
                rewardArr.push(`${diffTitle}획득가능 골드: ${reward.raid_rewardGold}G\n`);
                totalGold += parseInt(reward.raid_rewardGold);
            }
        } else {
            for (const reward of rewards) {
                const diffTitle = (rewardLength > 1) ? `[${reward.raid_phase}관문] 입장레벨: ${reward.raid_minItemLevel}${reward.raid_maxItemLevel ? `, 골드획득불가: ${reward.raid_maxItemLevel}\n` : '\n'}` : '';
                rewardArr.push(`${diffTitle}골드: ${reward.raid_rewardGold}G${reward.raid_rewardItem?`\n재료: ${reward.raid_rewardItem}`:''}${reward.raid_bonus_amount?`, 더보기: ${reward.raid_bonus_amount}`:''}${reward.raid_bonus_amountGold?` (필요: ${reward.raid_bonus_amountGold} 골드)`:''}\n`);
                totalGold += parseInt(reward.raid_rewardGold);
                if(reward.raid_bonus_amountGold !== undefined && !isNaN(reward.raid_bonus_amountGold))
                    bonusGold += parseInt(reward.raid_bonus_amountGold);
            }
        }
        return `${title}\n${rewardArr.join('\n')}\n획득골드: ${totalGold}G${bonusGold !== 0 && !isNaN(bonusGold) ? ` / 더보기: ${bonusGold}G` : ''}\n이미지로 보기: https://loaapi.2er0.io/assets/images/${rewards[0].imageUrl}`;
    } else {
        return `${command.command} ${command.help}`;
    }
}


const queryRaids = async (data) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const raidValue1:string = data && data.name ? data.name : '';
        const raidValue2:string = data && data.diff ? data.diff : '';
        const selectQuery = 'SELECT raid.*, img.raid_reward_imageUrl as imageUrl FROM loa.LOA_CONF_RAID raid INNER JOIN loa.LOA_CONF_RAIDIMAGE img ON raid.raid_category = img.raid_category AND (img.raid_difficulty = raid.raid_difficulty OR img.raid_difficulty IS NULL) WHERE raid.raid_name = ? AND raid.raid_ko_difficulty = ?';
        const selectValues = [raidValue1, raidValue2];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        throw error;
        return null;
    } finally {
        conn.end();
    }
}

const changeRaidName = (str: string) => {
    switch(str) {
        case "오레하":
        case "ㅇㅀ":
        case "ㅇㄹㅎ":
            return { name: '오레하' };
        case "아르고스":
        case "ㅇㄺㅅ":
        case "ㅇㄹㄱㅅ":
            return { name: '아르고스' };
        case "발탄노말":
        case "발노":
        case "ㅂㅌㄴㅁ":
        case "ㅂㄴ":
            return { name: '발탄', diff: '노말'};
        case "발탄하드":
        case "발하":
        case "ㅂㅌㅎㄷ":
        case "ㅂㅎ":
            return { name: '발탄', diff: '하드'};
        case "비아키스노말":
        case "비아노말":
        case "비노":
        case "ㅂㅇㅋㅅㄴㅁ":
        case "ㅂㅇㄴㅁ":
        case "ㅂㄴ":
            return { name: '비아키스', diff: '노말' };
        case "비아키스하드":
        case "비아하드":
        case "비하":
        case "ㅂㅇㅋㅅㅎㄷ":
        case "ㅂㅇㅎㄷ":
        case "ㅂㅎ":
            return { name: '비아키스', diff: '하드'};
        case "쿠크세이튼":
        case "쿠크":
        case "ㅋㅋㅅㅇㅌ":
        case "ㅋㅋ":
            return { name: '쿠크세이튼' };
        case "아브렐슈드노말":
        case "아브노말":
        case "노브":
        case "ㅇㅂㄽㄷㄴㅁ":
        case "ㅇㅂㄹㅅㄷㄴㅁ":
        case "ㅇㅂㄴㅁ":
        case "ㄴㅂ":
            return { name: '아브렐슈드', diff: '노말'};
        case "아브렐슈드하드":
        case "아브하드":
        case "하브":
        case "하브렐슈드":
        case "ㅇㅂㄽㄷㅎㄷ":
        case "ㅇㅂㄹㅅㄷㅎㄷ":
        case "ㅇㅂㅎㄷ":
        case "ㅎㅂㄽㄷ":
        case "ㅎㅂㄹㅅㄷ":
        case "ㅎㅂ":
            return { name: '아브렐슈드', diff: '하드'};
        case "일리아칸노말":
        case "일노":
        case "노칸":
        case "일리노말":
        case "ㅇㄹㅇㅋㄴㅁ":
        case "ㅇㄴ":
        case "ㄴㅋ":
        case "ㅇㄹㄴㅁ":
            return { name: '일리아칸', diff: '노말' };
        case "일리아칸하드":
        case "일하":
        case "하칸":
        case "일리하드":
        case "ㅇㄹㅇㅋㅎㄷ":
        case "ㅇㅎ":
        case "ㅎㅋ":
        case "ㅇㅀㄷ":
        case "ㅇㄹㅎㄷ":
            return { name: '일리아칸', diff: '하드' };
        case "카양겔노말":
        case "카양노말":
        case "ㅋㅇㄱㄴㅁ":
        case "ㅋㅇㄴㅁ":
            return { name: '카양겔', diff: '노말'};
        case "카양겔하드":
        case "카양하드":
        case "ㅋㅇㄱㅎㄷ":
        case "ㅋㅇㅎㄷ":
            return { name: '카양겔', diff: '하드'};
        case "상아탑노말":
        case "상노탑":
        case "상노":
        case "ㅅㅇㅌㄴㅁ":
        case "ㅅㄴㅌ":
        case "ㅅㄴ":
            return { name: '상아탑', diff: '노말'};
        case "상아탑하드":
        case "상하탑":
        case "상하":
        case "ㅅㅇㅌㅎㄷ":
        case "ㅅㅎㅌ":
        case "ㅅㅎ":
            return { name: '상아탑', diff: '하드' };
        case "카멘노말":
        case "카노":
        case "ㅋㅁㄴㅁ":
        case "ㅋㄴ":
            return { name: '카멘', diff: '노말' };
        case "카멘하드":
        case "카하":
        case "ㅋㅁㅎㄷ":
        case "ㅋㅎ":
            return { name: '카멘', diff: '하드' };
        default: return 0;
    }
}


const raidReward: any = () => {
    return `${command.command} ${command.description}\n(${command.command} ${command.help})`
};

export default raidReward;