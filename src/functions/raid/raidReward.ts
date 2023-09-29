import axios from 'axios'
import global from '../../config/config'

const command: Record<string, string>= {
    command: global.prefix + '보상',
    help: '[오레하|아르고스|발탄노말|발탄하드|비아노말|비아하드|쿠크|아브노말|아브하드|일리노말|일리하드|카양겔노말|카양겔하드|상아탑노말|상아탑하드]',
    description: '레이드 보상을 볼 수 있습니다.'
}

export const raidRewardOreha = () => {
    return `[오레하 보상]\n입장가능 아이템 레벨: 1,325\n골드획득 불가 레벨 1,415\n노말: 500골드\n하드 700골드\n\nhttps://loaapi.2er0.io/assets/images/Oreha/Oreha.png`
}

export const raidRewardAreugoseu = () => {
    return `[아르고스 보상]\n입장가능 레벨: 1,385\n골드획득 불가 레벨: 1,475\n1페이즈: 300골드, 2페이즈: 300골드, 3페이즈: 400골드\nhttps://loaapi.2er0.io/assets/images/Areugoseu/Areugoseu.png`
}

export const raidRewardBaltanNormal = () => {
    return `[발탄(노말) 보상]\n입장가능 레벨: 1,415\n[1관문]\n골드: 500골드\n재료: 마수의뼈x1, 마수의 힘줄x3\n더보기: 마수의뼈x1, 마수의 힘줄x3(필요골드 300골드)\n[2관문]\n골드: 700골드\n재료: 마수의뼈x2, 마수의 힘줄x3\n더보기: 마수의뼈x1, 마수의 힘줄x3(필요골드 400골드)\nhttps://loaapi.2er0.io/assets/iamges/Baltan/normal.png`
}

export const raidRewardBaltanHard = () => {
    return `[발탄(하드) 보상]\n입장가능 레벨: 1,445\n[1관문]\n골드: 700 골드\n재료: 마수의뼈x3\n더보기 재료: 마수의뼈x3 (필요골드: 450골드)\n[2관문]\n골드: 1,100골드\n재료: 마수의뼈x3\n더보기 재료: 마수의뼈x3 (필요골드: 600골드)\nhttps://loaapi.2er0.io/assets/images/Baltan/hard.png`
}

export const raidRewardBiackissNormal = () => {
    return `[비아키스(노말) 보상]\n입장가능 레벨: 1,430\n[1관문]\n골드: 600골드\n재료: 욕망의날개x1, 욕망의송곳니x2\n더보기 재료: 욕망의날개x1, 욕망의송곳니x2 (필요 골드: 300골드)\n[2관문]\n골드: 1,000골드\n재료: 욕망의날개x2, 욕망의송곳니x4\n더보기 재료: 욕망의날개x2, 욕망의송곳니x4 (필요 골드: 450 골드)\nhttps://loaapi.2er0.io/assets/images/Biackiss/normal.png`
}

export const raidRewardBiackissHard = () => {
    return `[비아키스(하드) 보상]\n입장가능 레벨: 1,460\n[1관문]\n골드: 900 골드\n재료: 욕망의날개x3\n더보기 재료: 욕망의날개x3 (필요 골드: 500골드)\n[2관문]\n골드: 1,500골드\n재료: 욕망의날개x3\n더보기 재료: 욕망의날개x3 (필요 골드: 650골드)\nhttps://loaapi.2er0.io/assets/images/Biackiss/hard.png`
}

export const raidRewardKoukuSaton = () => {
    return `[쿠크세이튼 보상]\n입장가능 레벨: 1,475\n[1관문]\n골드: 600골드\n재료: 광기의나팔x1\n더보기 재료: 광기의나팔x1 (필요 골드: 300골드)\n[2관문]\n골드: 900골드\n재료: 광기의나팔x2\n더보기 재료: 광기의나팔x2 (필요 골드: 500골드)\n[3관문]\n골드: 1,500골드\n재료: 광기의나팔x2\n더보기 재료: 광기의나팔x2 (필요 골드: 700골드)\nhttps://loaapi.2er0.io/assets/images/Kouku-Saton/Kouku-Saton.png`
}

export const raidRewardAbrelshudNormal = () => {
    return `[아브렐슈드(노말) 보상]\n[1관문]\n입장가능 레벨: 1,490\n골드: 1,500골드\n재료: 몽환의사념x4\n더보기 재료: 몽환의사념x4 (필요 골드: 400골드)\n[2관문]\n입장가능 레벨: 1,490\n골드: 1,500골드\n재료: 몽환의사념x4\n더보기 재료: 몽환의사념x4 (필요 골드: 600골드)\n[3관문]\n입장가능 레벨: 1,500\n골드: 1,500골드\n재료: 몽환의사념x5\n더보기 재료: 몽환의사념x5 (필요 골드: 800골드)\n[4관문]\n입장가능 레벨: 1,520\n골드: 2,500골드\n재료: 몽환의사념x7\n더보기 재료: 몽환의사념x7 (필요 골드: 1,50골드)\nhttps://loaapi.2er0.io/assets/images/Abrelshud/normal.png`
}

export const raidRewardAbrelshudHard = () => {
    return `[쿠크세이튼 보상]\n[1관문]\n입장가능 레벨: 1,540\n골드: 2,000골드\n재료: 몽환의사념x6\n더보기 재료: 몽환의사념x6 (필요 골드: 700골드)\n[2관문]\n입장가능 레벨: 1,540\n골드: 2,000골드\n재료: 몽환의사념x6\n더보기 재료: 몽환의사념x6 (필요 골드: 900골드)\n[3관문]\n입장가능 레벨: 1,550\n골드: 2,000골드\n재료: 몽환의사념x7\n더보기 재료: 몽환의사념x7 (필요 골드: 1,100골드)\n[4관문]\n입장가능 레벨: 1,560\n골드: 3,000골드\n재료: 몽환의사념x10\n더보기 재료: 몽환의사념x10 (필요 골드: 1,800골드)\nhttps://loaapi.2er0.io/assets/images/Abrelshud/hard.png`
}

export const raidRewardIlliakanNormal = () => {
    return `[일리야칸(노말) 보상]\n입장가능 레벨: 1,580\n[1관문]\n골드: 1,500골드\n재료: 쇠락의눈동자x3\n더보기 재료: 쇠락의눈동자x3 (필요 골드: 900골드)\n[2관문]\n골드: 2,000골드\n재료: 쇠락의눈동자x3\n더보기 재료: 쇠락의눈동자x3 (필요 골드: 1,100골드)\n[3관문]\n골드: 3,000골드\n재료: 쇠락의눈동자x5\n더보기 재료: 쇠락의눈동자x5 (필요 골드: 1,500골드)\nhttps://loaapi.2er0.io/assets/images/Illiakan/normal.png`
}

export const raidRewardIlliakanHard = () => {
    return `[일리야칸(하드) 보상]\n입장가능 레벨: 1,600\n[1관문]\n골드: 1,750골드\n재료: 쇠락의눈동자x7\n더보기 재료: 쇠락의눈동자x7 (필요 골드: 1,200골드)\n[2관문]\n골드: 2,500골드\n재료: 쇠락의눈동자x7\n더보기 재료: 쇠락의눈동자x7 (필요 골드: 1,400골드)\n[3관문]\n골드: 5,750골드\n재료: 쇠락의눈동자x8\n더보기 재료: 쇠락의눈동자x8 (필요 골드: 1,900골드)\nhttps://loaapi.2er0.io/assets/images/Illiakan/hard.png`
}

export const raidRewardKayanggelNormal = () => {
    return `[카양겔(노말) 보상]\n입장가능 레벨: 1,540\n[1관문]\n골드: 1,000골드\n재료: 시련의빛x11\n더보기 재료: 시련의빛x11 (필요 골드: 600골드)\n[2관문]\n골드: 1,500골드\n재료: 시련의빛x12,관조의빛x1\n더보기 재료: 시련의빛x12,관조의빛x1 (필요 골드: 800골드)\n[3관문]\n골드: 2,000골드\n재료: 시련의빛x17,관조의빛x2\n더보기 재료: 시련의빛x17,관조의빛x2 (필요 골드: 1,000골드)\n[합계] 보상골드: 4,500골드, 더보기 필요 골드: 2,400골드, 재료: 시련의빛x40, 관조의빛x3, 더보기 재료: 시련의빛x40, 관조의빛x3\nhttps://loaapi.2er0.io/assets/images/Kayanggel/normal.png`
}

export const raidRewardKayanggelHard = () => {
    return `[카양겔(하드) 보상]\n입장가능 레벨: 1,580\n[1관문]\n골드: 1,500골드\n재료: 시련의빛x14, 관조의빛x1\n더보기 재료: 시련의빛x14, 관조의빛x1 (필요 골드: 700골드)\n[2관문]\n골드: 2,000골드\n재료: 시련의빛x16,관조의빛x1\n더보기 재료: 시련의빛x16,관조의빛x1 (필요 골드: 900골드)\n[3관문]\n골드: 3,000골드\n재료: 시련의빛x20,관조의빛x3\n더보기 재료: 시련의빛x20,관조의빛x3 (필요 골드: 1,100골드)\n[합계] 보상골드: 6,500골드, 더보기 필요 골드: 2,600골드, 재료: 시련의빛x50, 관조의빛x5, 더보기 재료: 시련의빛x50, 관조의빛x5\nhttps://loaapi.2er0.io/assets/images/Kayanggel/hard.png`
}

export const raidRewardSangatapNormal = () => {
    return `[상아탑(노말) 보상]\n입장가능 레벨: 1,600\n[1관문] 골드: 1,500\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 700골드)\n[2관문] 골드: 1,750\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 800골드)\n[3관문] 골드: 2,250\n재료: 지혜의기운x3\n더보기 재료: 지혜의기운x3 (필요 골드: 900골드)\n[4관문] 골드: 3,250\n재료: 지혜의기운x1, 엘릭서x1\n더보기 재료: 지혜의기운x1, 엘릭서x1 (필요 골드: 1,100골드)\n[합계] 골드: 9,000골드, 더보기 필요 골드: 3,500골드, 재료: 지혜의기운x8, 엘릭서x1, 더보기 재료: 지혜의기운x8, 엘릭서x1\nhttps://loaapi.2er0.io/assets/images/Sangatap/normal.png`
}

export const raidRewardSangatapHard = () => {
    return `[상아탑(하드) 보상]\n입장가능 레벨: 1,620\n[1관문] 골드: 2,000\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 1,000골드)\n[2관문] 골드: 2,500\n재료: 지혜의기운x2\n더보기 재료: 지혜의기운x2 (필요 골드: 1,000골드)\n[3관문] 골드: 4,000\n재료: 지혜의기운x3\n더보기 재료: 지혜의기운x3 (필요 골드: 1,500골드)\n[4관문] 골드: 6,000\n재료: 지혜의기운x1, 엘릭서x1\n더보기 재료: 지혜의기운x1, 엘릭서x1 (필요 골드: 2,000골드)\n[합계] 골드: 14,500골드, 더보기 필요 골드: 5,500골드, 재료: 지혜의기운x8, 엘릭서x1, 더보기 재료: 지혜의기운x8, 엘릭서x1\nhttps://loaapi.2er0.io/assets/images/Sangatap/hard.png`
}

const raidReward: any = () => {
    return `${command.command} ${command.description}\n(${command.command} ${command.help})`
};

export default raidReward;