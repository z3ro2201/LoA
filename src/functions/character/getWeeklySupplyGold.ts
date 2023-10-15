import axios from 'axios';
import global from '../../config/config';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'

interface SubCharacter {
  itemLevel: number;
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

    // 레이드 데이터를 가져온다
    const raidList = await queryRaids();
    for(const character of characterListArr){
      const tmpData = checkRaidLevel(character, raidList);
      console.log(tmpData)
    }
    // 레이드 데이터를 카테고리별로 구분
    // const raidDataByCategory: { [key: string]: SubCharacter[] } = {};
    // for (const character of characterListArr) {
    // }

    let characterData = `[${characterServer[0].ServerName} 서버]`;

    return characterData.trim(); // 문자열 앞뒤의 공백 제거
  } catch (error) {
    throw error; // 오류를 호출자로 던짐
  }
}

const queryRaids = async () => {
  const conn = initDb();
  await connectDb(conn);
  try {
      const selectQuery = 'SELECT raid_category, raid_ko_difficulty, raid_name, raid_phase, raid_minItemLevel, raid_maxItemLevel, raid_rewardGold FROM loa.LOA_CONF_RAID ORDER BY raid_minItemLevel DESC';
      const result = await queryDb(conn, selectQuery);
      return result;
  } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
  } finally {
      conn.end();
  }
}

const checkRaidLevel = (character: SubCharacter, raidData) => {
  const characterRaidList = [];

  for (const raidInfo of raidData) {
    if (
      raidInfo.raid_minItemLevel <= character.itemLevel &&
      (raidInfo.raidItemMaxLevel === 0 ||
        character.itemLevel <= raidInfo.raidItemMaxLevel)
    ) {
      // 일치하는 경우 레이드 정보를 추가
      characterRaidList.push({
        raidName: raidInfo.raidName,
        raidGold: raidInfo.raidGold,
        raidCategory: raidInfo.raidCategory,
      });
    }
  }

  // 레이드 정보를 카테고리로 그룹화
  const groupedRaidList = characterRaidList.reduce((result, raid) => {
    const category = raid.raidCategory;

    if (!result[category]) {
      result[category] = [];
    }

    result[category].push(raid);

    return result;
  }, {});

  // 카테고리가 3개인 경우에만 리턴
  const selectedCategories = Object.keys(groupedRaidList).slice(0, 3);

  const result = selectedCategories.map(category => {
    return {
      raidCategory: category,
      raids: groupedRaidList[category],
    };
  });

  return result;
};

export default weeklySupplyGold;
