import axios from 'axios';
import global from '../../config/config';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
/**
 * 맨 위에 4관은 빼고 계산함.
※ 하드 아브렐슈드 (4관) - 3000골
※ 하드 카멘 (4관) - 21000골

노말 아브렐이 1관문 1490 2관문 1490 3관문 1500 4관문 1520인가 그렇고
하드 아브렐이 1관문 1540 2관문 1540 3관문 1550 4관문 1560이라
 * 
 */
interface SubCharacter {
  itemLevel: number;
  combatLevel: number;
  characterName: string;
  characterClass: string;
  raidName?: string; // 레이드 정보를 담을 수 있도록 수정
  raidGold?: number; // 레이드 정보를 담을 수 있도록 수정
}

async function weeklySupplyGold(characterName: string) {
  const apiUrl = `${global.apiUrl.lostark}characters/${characterName}/siblings`;

  try {
    const response = await axios.get(apiUrl, {
      headers: global.token.lostarkHeader,
    });

    const data = response.data;

    // 캐릭터목록
    const characterServer = data.filter(
      (characterData) => characterData.CharacterName === characterName
    );
    const characterListArr: SubCharacter[] = [];
    for (const tmp of data) {
      if (characterServer[0].ServerName === tmp.ServerName)
        characterListArr.push({
          itemLevel: parseFloat(tmp.ItemAvgLevel.replace(',', '')),
          combatLevel: parseInt(tmp.CharacterLevel),
          characterName: tmp.CharacterName,
          characterClass: tmp.CharacterClassName,
        });
    }

    // 레벨 순 정렬
    characterListArr.sort(
      (a: SubCharacter, b: SubCharacter) => b.itemLevel - a.itemLevel
    );

    // 레벨 순 정렬 후 최대 6캐릭터만 나오게 한다
    if (characterListArr.length > 6) characterListArr.length = 6;

    // raidListData
    const raidListData = await checkRaidList(characterListArr);
    if(raidListData !== 0) {
      let goldTotal = 0;
      const characterRiceList = [];
      const characterRiceDetail = [];
      raidListData.forEach((characterRiceData) => {
        const tmpCharacterRiceData = [];
        const riceCategory = Object.values(characterRiceData.categoryRiceData);
        riceCategory.forEach((riceDataArray) => {
          const diffData = {};
          if (Array.isArray(riceDataArray)) {
            const diffName = riceDataArray[0].diff;
            riceDataArray.forEach((riceData) => {
              if(riceData.riceWeek === 0) {
              const { diff, riceGold } = riceData;
              if (!diffData[diff]) {
                diffData[diff] = [];
              }
              diffData[diff].push(riceGold);
            }
            });
            const keys = Object.keys(diffData);
            console.log(diffData)
            keys.forEach((key) => {
              const values = diffData[key];
              const total = values.reduce((sum, value) => sum + value, 0);
              const diffName = key !== 'null' ? ` [${key}]` : '';
              const phase = values.length > 1 ? ` 1~${values.length}관문` : '';
              const riceName = riceDataArray[0].riceName;
              tmpCharacterRiceData.push({riceName: `${riceName}${diffName}${phase}`, riceDiff: diffName, riceGold: total});
            });
          }
        });
        tmpCharacterRiceData.sort((a, b) => b.riceGold - a.riceGold);
        const riceGoldSortingData = tmpCharacterRiceData.slice(0, 3);
        const tmpSortingData = [];
        let groupGoldTot = 0;
        riceGoldSortingData.map((sortData) => {
          tmpSortingData.push(`${sortData.riceName}: ${sortData.riceGold}`)
          goldTotal += sortData.riceGold;
          groupGoldTot += sortData.riceGold;
        });
        characterRiceList.push(`${characterRiceData.characterLevel} ${characterRiceData.characterClassName} ${characterRiceData.characterItemLevel} ${characterRiceData.characterName}: ${groupGoldTot}`);
        characterRiceDetail.push(`${characterRiceData.characterLevel} ${characterRiceData.characterClassName} ${characterRiceData.characterItemLevel} ${characterRiceData.characterName} \n- ${tmpSortingData.join('\n- ')}\n ㄴ 수급가능: ${groupGoldTot}\n`);

      })
      return `[주급(BETA)] (* 버그제보, 2주단위레이드제외)\n\n${characterRiceList.join('\n')}\n\n수급가능골드: ${goldTotal}\n\n[상세 내용은 전체보기]\n~~\n${characterRiceDetail.join('\n')}\n* 2주에 한번 도는 레이드의 경우 제외처리 되었습니다.`;
    } else {
      return `요청하신 캐릭터는 주급(주간골드수급)데이터를 생성할 수 없습니다.`;
    }
  } catch (error) {
    throw error; // 오류를 호출자로 던짐
  }
}

const queryRaids = async () => {
  const conn = initDb();
  try {
    const selectQuery = 'SELECT raid_category, raid_ko_difficulty, raid_name, raid_phase, raid_minItemLevel, raid_maxItemLevel, raid_rewardGold, raid_weeks FROM loa.LOA_CONF_RAID ORDER BY raid_minItemLevel DESC';
    const result = await queryDb(conn, selectQuery);
    return result;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  } finally {
    conn.end();
  }
}

const checkRaidList = async (characterData) => {
  // 레이드 목록을 가져와서 배열로 저장한다
  const raidList = await queryRaids();
  const riceList = [];

  // 캐릭터 데이터를 기준으로 레이드 목록을 조회
  for(const character of characterData) {
    let riceTotal = 0;
    const tmpCharacterRaidData = {
      characterClassName: character.characterClass,
      characterName: character.characterName,
      characterLevel: character.combatLevel,
      characterItemLevel: character.itemLevel,
      categoryRiceData: {},
      riceTotal: 0
    };

    for (const raidData of raidList) {
      const characterLevel = parseFloat(character.itemLevel);
      const minLevel = parseInt(raidData.raid_minItemLevel) || 0;
      const maxLevel = parseInt(raidData.raid_maxItemLevel) || 0;
      
      if (characterLevel >= minLevel && (maxLevel === 0 || (maxLevel !== 0 && characterLevel <= maxLevel))) {
        const raidName = raidData.raid_name;
        const category = raidData.raid_category;
        
        if (!tmpCharacterRaidData.categoryRiceData[category]) {
          tmpCharacterRaidData.categoryRiceData[category] = [];
        }

        const difficulty = raidData.raid_ko_difficulty ? raidData.raid_ko_difficulty : null;
        const phaseInfo = raidData.raid_phase > 0 ? parseInt(raidData.raid_phase) : null;
        const riceWeeks = raidData.raid_weeks !== null ? raidData.raid_weeks : 0;

        const raidInfo = {
          riceName: raidData.raid_name,
          diff: difficulty,
          phase: phaseInfo,
          riceGold: parseFloat(raidData.raid_rewardGold),
          riceWeek: riceWeeks
        };
        
        if (category in tmpCharacterRaidData.categoryRiceData) {
           if(tmpCharacterRaidData.categoryRiceData[category].length < 1) {
            tmpCharacterRaidData.categoryRiceData[category].push(raidInfo);
           } else {
            if(tmpCharacterRaidData.categoryRiceData[category][0].diff === difficulty)
              tmpCharacterRaidData.categoryRiceData[category].push(raidInfo);
           }
        } 
        riceTotal += parseFloat(raidData.raid_rewardGold);
      }
    }

    // 상위 3개 던전만 출력하도록 바꿈
    const top3Categories = Object.keys(tmpCharacterRaidData.categoryRiceData).slice(0, 3);
    tmpCharacterRaidData.categoryRiceData = top3Categories.reduce((result, category) => {
      result[category] = tmpCharacterRaidData.categoryRiceData[category];
      return result;
    }, {});

    const categoryRiceDataSize = Object.keys(tmpCharacterRaidData.categoryRiceData).length;
    if (categoryRiceDataSize > 0) {
      tmpCharacterRaidData.riceTotal = riceTotal;
      riceList.push(tmpCharacterRaidData);
    }
  }
  const riceDataSize = Object.keys(riceList).length;
  return riceDataSize > 0 ? riceList : 0;
}
export default weeklySupplyGold;
