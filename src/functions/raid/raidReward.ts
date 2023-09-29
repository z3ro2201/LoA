import axios from 'axios'
import global from '../../config/config'

const command: Record<string, string>= {
    command: global.prefix + '보상',
    help: '[오레하|아르고스|발탄노말|발탄하드|비아노말|비아하드|쿠크|아브노말|아브하드|일리노말|일리하드|카양겔노말|카양겔하드|상아탑노말|상아탑하드]',
    description: '레이드 보상을 볼 수 있습니다.'
}

export const raidRewardOreha = () => {
    const reward = {
        level : '1,325',
        checkpoint_1: '500 골드',
        checkpoint_2: '700 골드',
        total: '1,200 골드'
    };
    return `[오레하 보상]\n입장가능 아이템 레벨: ${reward.level}\n골드획득 불가 레벨 1,415\n\n노말: ${reward.checkpoint_1}\n하드 ${reward.checkpoint_2}\n\nhttps://loaapi.2er0.io/assets/images/Oreha/Oreha.png`
}

export const raidRewardAreugoseu = () => {
    const reward = {
        level: '1,385',
        checkpoint_1: '300 골드',
        checkpoint_2: '300 골드',
        checkpoint_3: '400 골드',
        total: '1,000 골드'
    };
    return `[아르고스 보상]\n입장가능 레벨: ${reward.level}\n골드획득 불가 레벨: 1,475\n\n1페이즈: ${reward.checkpoint_1}, 2페이즈: ${reward.checkpoint_2}, 3페이즈: ${reward.checkpoint_3}\n\nhttps://loaapi.2er0.io/assets/images/Areugoseu/Areugoseu.png`
}

export const raidRewardBaltanNormal:any = (isGold: string) => {
    const reward = {
        level: '1,415',
        checkpoint_1: '500 골드',
        checkpoint_2: '700 골드',
        total: '1,200 골드'
    };
    let message = `[발탄(노말) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 2; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 마수의뼈x1, 마수의 힘줄x3\n더보기: 마수의뼈x1, 마수의 힘줄x3(필요골드 300골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}골드\n재료: 마수의뼈x2, 마수의 힘줄x3\n더보기: 마수의뼈x1, 마수의 힘줄x3(필요골드 400골드)\n\nhttps://loaapi.2er0.io/assets/iamges/Baltan/normal.png`
    return `${message}`;
}

export const raidRewardBaltanHard = (isGold: string) => {
    const reward = {
        level: '1,445',
        checkpoint_1: '700 골드',
        checkpoint_2: '1,100 골드',
        total: '1,800 골드'
    };
    let message = `[발탄(노말) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 2; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 마수의뼈x3\n더보기 재료: 마수의뼈x3 (필요골드: 450골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}골드\n재료: 마수의뼈x3\n더보기 재료: 마수의뼈x3 (필요골드: 600골드)\n\nhttps://loaapi.2er0.io/assets/images/Baltan/hard.png`
    return message;
}

export const raidRewardBiackissNormal = (isGold: string) => {
    const reward = {
        level: '1,430',
        checkpoint_1: '600 골드',
        checkpoint_2: '1,000 골드',
        total: '1,600 골드'
    };
    let message = `[비아키스(노말) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 2; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message = `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 욕망의날개x1, 욕망의송곳니x2\n더보기 재료: 욕망의날개x1, 욕망의송곳니x2 (필요 골드: 300골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 욕망의날개x2, 욕망의송곳니x4\n더보기 재료: 욕망의날개x2, 욕망의송곳니x4 (필요 골드: 450 골드)\n\nhttps://loaapi.2er0.io/assets/images/Biackiss/normal.png`
    return message;
}

export const raidRewardBiackissHard = (isGold: string) => {
    const reward = {
        level: '1,460',
        checkpoint_1: '900 골드',
        checkpoint_2: '1,500 골드',
        total: '2,400 골드'
    };
    let message = `[비아키스(하드) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 2; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 욕망의날개x3\n더보기 재료: 욕망의날개x3 (필요 골드: 500골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}}\n재료: 욕망의날개x3\n더보기 재료: 욕망의날개x3 (필요 골드: 650골드)\n\nhttps://loaapi.2er0.io/assets/images/Biackiss/hard.png`
    return message;
}

export const raidRewardKoukuSaton = (isGold: string) => {
    const reward = {
        level: '1,475',
        checkpoint_1: '600 골드',
        checkpoint_2: '900 골드',
        checkpoint_3: '1,500골드',
        total: '3,000 골드'
    };
    let message = `[쿠크세이튼 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 3; i++) {
            const level = 'level_' + i;
            const level_key = reward[level];
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]}\n획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 광기의나팔x1\n더보기 재료: 광기의나팔x1 (필요 골드: 300골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 광기의나팔x2\n더보기 재료: 광기의나팔x2 (필요 골드: 500골드)\n\n[3관문]\n골드: ${reward.checkpoint_3}\n재료: 광기의나팔x2\n더보기 재료: 광기의나팔x2 (필요 골드: 700골드)\\nnhttps://loaapi.2er0.io/assets/images/Kouku-Saton/Kouku-Saton.png`
    return message
}

export const raidRewardAbrelshudNormal = (isGold: string) => {
    const reward = {
        level_1: '1,490',
        level_2: '1,500',
        level_3: '1,500',
        level_4: '1,520',
        checkpoint_1: '1,500 골드',
        checkpoint_2: '1,500 골드',
        checkpoint_3: '1,500 골드',
        checkpoint_4: '2,500 골드',
        total: '7,000 골드'
    };
    let message = `[아브렐슈드(노말) 보상]`;
    if(isGold === "true") {
        for (var i = 1; i <= 4; i++) {
            const level = 'level_' + i;
            const level_key = reward[level];
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 입장가능레벨: ${level_key}\n획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n입장가능 레벨: ${reward.level_1}\n골드:${reward.checkpoint_1}\n재료: 몽환의사념x4\n더보기 재료: 몽환의사념x4 (필요 골드: 400골드)\n\n[2관문]\n입장가능 레벨: ${reward.level_2}\n골드: ${reward.checkpoint_2}\n재료: 몽환의사념x4\n더보기 재료: 몽환의사념x4 (필요 골드: 600골드)\n\n[3관문]\n입장가능 레벨: ${reward.level_3}\n골드: ${reward.checkpoint_3}\n재료: 몽환의사념x5\n더보기 재료: 몽환의사념x5 (필요 골드: 800골드)\n\n[4관문]\n입장가능 레벨: ${reward.level_4}\n골드: ${reward.checkpoint_4}\n재료: 몽환의사념x7\n더보기 재료: 몽환의사념x7 (필요 골드: 1,50골드)\nhttps://loaapi.2er0.io/assets/images/Abrelshud/normal.png`
    return message;
}

export const raidRewardAbrelshudHard = (isGold: string) => {
    const reward = {
        level_1: '1,540',
        level_2: '1,540',
        level_3: '1,550',
        level_4: '1,560',
        checkpoint_1: '2,000 골드',
        checkpoint_2: '2,000 골드',
        checkpoint_3: '2,000 골드',
        checkpoint_4: '3,000 골드',
        total: '9,000 골드'
    };
    let message = `[쿠크세이튼 보상]`;
    if(isGold === "true") {
        for (var i = 1; i <= 4; i++) {
            const level = 'level_' + i;
            const level_key = reward[level];
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 입장가능레벨: ${level_key}\n획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n입장가능 레벨: ${reward.level_1}\n골드: ${reward.checkpoint_1}\n재료: 몽환의사념x6\n더보기 재료: 몽환의사념x6 (필요 골드: 700골드)\n\n[2관문]\n입장가능 레벨: ${reward.level_2}\n골드: ${reward.checkpoint_2}\n재료: 몽환의사념x6\n더보기 재료: 몽환의사념x6 (필요 골드: 900골드)\n\n[3관문]\n입장가능 레벨: ${reward.level_3}\n골드: ${reward.checkpoint_3}\n재료: 몽환의사념x7\n더보기 재료: 몽환의사념x7 (필요 골드: 1,100골드)\n\n[4관문]\n입장가능 레벨: ${reward.level_4}\n골드: ${reward.checkpoint_4}\n재료: 몽환의사념x10\n더보기 재료: 몽환의사념x10 (필요 골드: 1,800골드)\n\nhttps://loaapi.2er0.io/assets/images/Abrelshud/hard.png`
    return message;
}

export const raidRewardIlliakanNormal = (isGold: string) => {
    const reward = {
        level: '1,580',
        checkpoint_1: '1,500 골드',
        checkpoint_2: '2,000 골드',
        checkpoint_3: '3,000 골드',
        total: '6,500 골드'
    };
    let message = `[일리야칸(노말) 보상]\n\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 3; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 쇠락의눈동자x3\n더보기 재료: 쇠락의눈동자x3 (필요 골드: 900골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 쇠락의눈동자x3\n더보기 재료: 쇠락의눈동자x3 (필요 골드: 1,100골드)\n\n[3관문]\n골드: ${reward.checkpoint_3}\n재료: 쇠락의눈동자x5\n더보기 재료: 쇠락의눈동자x5 (필요 골드: 1,500골드)\n\nhttps://loaapi.2er0.io/assets/images/Illiakan/normal.png`
    return message;
}

export const raidRewardIlliakanHard = (isGold: string) => {
    const reward = {
        level: '1,600',
        checkpoint_1: '1,750 골드',
        checkpoint_2: '2,500 골드',
        checkpoint_3: '5,750 골드',
        total: '10,000 골드'
    };
    let message = `[일리야칸(하드) 보상]\n\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 3; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드:${reward.checkpoint_1}\n재료: 쇠락의눈동자x7\n더보기 재료: 쇠락의눈동자x7 (필요 골드: 1,200골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 쇠락의눈동자x7\n더보기 재료: 쇠락의눈동자x7 (필요 골드: 1,400골드)\n\n[3관문]\n골드: ${reward.checkpoint_3}\n재료: 쇠락의눈동자x8\n더보기 재료: 쇠락의눈동자x8 (필요 골드: 1,900골드)\n\nhttps://loaapi.2er0.io/assets/images/Illiakan/hard.png`
    return message;
}

export const raidRewardKayanggelNormal = (isGold: string) => {
    const reward = {
        level: '1,540',
        checkpoint_1: '1,000 골드',
        checkpoint_2: '1,500 골드',
        checkpoint_3: '2,000 골드',
        total: '4,500 골드'
    };
    let message = `[카양겔(노말) 보상]\n\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 3; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 시련의빛x11\n더보기 재료: 시련의빛x11 (필요 골드: 600골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 시련의빛x12,관조의빛x1\n더보기 재료: 시련의빛x12,관조의빛x1 (필요 골드: 800골드)\n[3관문]\n골드: ${reward.checkpoint_3}\n재료: 시련의빛x17,관조의빛x2\n더보기 재료: 시련의빛x17,관조의빛x2 (필요 골드: 1,000골드)\n\n[합계] 보상골드: ${reward.total}, 더보기 필요 골드: 2,400골드, 재료: 시련의빛x40, 관조의빛x3, 더보기 재료: 시련의빛x40, 관조의빛x3\n\nhttps://loaapi.2er0.io/assets/images/Kayanggel/normal.png`
    return message;
}

export const raidRewardKayanggelHard = (isGold: string) => {
    const reward = {
        level: '1,580',
        checkpoint_1: '1,500 골드',
        checkpoint_2: '2,000 골드',
        checkpoint_3: '3,000 골드',
        total: '6,500 골드'
    };
    let message = `[카양겔(하드) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 3; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문]\n골드: ${reward.checkpoint_1}\n재료: 시련의빛x14, 관조의빛x1\n더보기 재료: 시련의빛x14, 관조의빛x1 (필요 골드: 700골드)\n\n[2관문]\n골드: ${reward.checkpoint_2}\n재료: 시련의빛x16,관조의빛x1\n더보기 재료: 시련의빛x16,관조의빛x1 (필요 골드: 900골드)\n[3관문]\n골드: ${reward.checkpoint_3}\n재료: 시련의빛x20,관조의빛x3\n더보기 재료: 시련의빛x20,관조의빛x3 (필요 골드: 1,100골드)\n\n[합계] 보상골드: ${reward.total}, 더보기 필요 골드: 2,600골드, 재료: 시련의빛x50, 관조의빛x5, 더보기 재료: 시련의빛x50, 관조의빛x5\n\nhttps://loaapi.2er0.io/assets/images/Kayanggel/hard.png`
    return message;
}

export const raidRewardSangatapNormal = (isGold: string) => {
    const reward = {
        level: '1,600',
        checkpoint_1: '1,500 골드',
        checkpoint_2: '1,750 골드',
        checkpoint_3: '2,250 골드',
        checkpoint_4: '3,250 골드',
        total: '8,750 골드'
    };
    let message = `[상아탑(노말) 보상]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 4; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문] 골드: ${reward.checkpoint_1}\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 700골드)\n\n[2관문] 골드: ${reward.checkpoint_2}\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 800골드)\n\n[3관문] 골드: ${reward.checkpoint_3}\n재료: 지혜의기운x3\n더보기 재료: 지혜의기운x3 (필요 골드: 900골드)\n\n[4관문] 골드: ${reward.checkpoint_4}\n재료: 지혜의기운x1, 엘릭서x1\n더보기 재료: 지혜의기운x1, 엘릭서x1 (필요 골드: 1,100골드)\n\n[합계] 골드: ${reward.total}, 더보기 필요 골드: 3,500골드, 재료: 지혜의기운x8, 엘릭서x1, 더보기 재료: 지혜의기운x8, 엘릭서x1\n\nhttps://loaapi.2er0.io/assets/images/Sangatap/normal.png`
    return message;
}

export const raidRewardSangatapHard = (isGold: string) => {
    const reward = {
        level: '1,620',
        checkpoint_1: '2,000 골드',
        checkpoint_2: '2,500 골드',
        checkpoint_3: '4,000 골드',
        checkpoint_4: '6,000 골드',
        total: '14,500 골드'
    };
    let message = `[상아탑(노말) 하드]\n입장가능 레벨: ${reward.level}`;
    if(isGold === "true") {
        for (var i = 1; i <= 4; i++) {
            const checkpoint = 'checkpoint_' + i;
            const checkpoint_key = reward[checkpoint];
            message += `\n[${i}관문]\n 획득가능 골드: ${checkpoint_key}\n`;
        }
    }
    else message += `\n[1관문] 골드: ${reward.checkpoint_1}\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 1,000골드)\n\n[2관문] 골드: ${reward.checkpoint_2}\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 1,000골드)\n\n[3관문] 골드: ${reward.checkpoint_3}\n재료: 지혜의기운x3\n더보기 재료: 지혜의기운x3 (필요 골드: 1,500골드)\n\n[4관문] 골드: ${reward.checkpoint_4}\n재료: 지혜의기운x1, 엘릭서x1\n더보기 재료: 지혜의기운x1, 엘릭서x1 (필요 골드: 2,000골드)\n\n[합계] 골드: ${reward.total}, 더보기 필요 골드: 5,500골드, 재료: 지혜의기운x8, 엘릭서x1, 더보기 재료: 지혜의기운x8, 엘릭서x1\n\nhttps://loaapi.2er0.io/assets/images/Sangatap/hard.png`
    return message;
}

const raidReward: any = () => {
    return `${command.command} ${command.description}\n(${command.command} ${command.help})`
};

export default raidReward;