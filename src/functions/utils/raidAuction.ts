import axios from 'axios'
import global from '../../config/config'

const command: Record<string, string>= {
    command: global.prefix + '경매',
    help: '인수 금액',
    description: '레이드 경매 입찰가를 계산합니다. (본인포함 최소 2인 ~ 16인)'
}

const raidAuction: any = (ta:number, gold:number) => {
    if(ta > 16|| ta < 1) console.log('최소 본인을 포함한 2인, 최대는 16인 입니다.');
    const Player = ta - 1;
    const SC = gold * 0.05; // 판매수수료
    const DIV = SC / Player; // 분배금
    const SCV = gold - SC; // 금액 - 판매수수료
    const PD = Player / ta; // 본인을 제외한 플레이어수 / 본인 포함한 플레이어수
    const BEP = Math.floor(SCV * PD); // 손익분기점 (금액 - 판매수수료) * 플레이어 분배
    const BP = Math.floor(BEP / 1.1); // 입찰적정가 (손익분기점 / 1.1)
    const JG = Math.floor(BP / 1.1); // 바로구매 (입찰적정가 / 1.1)
    return `경매 입찰 최적가 [🪙 ${gold}]\n• 손익분기점 [🪙 ${BEP}]\n• 입찰적정가 [🪙 ${BP}]\n• 즉시구매가 [🪙 ${JG}]`
};

export default raidAuction;