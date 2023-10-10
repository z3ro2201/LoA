import axios from 'axios';
import global from '../../config/config';
import { raidData } from '../../shareData/raidData';

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

    // 레이드 데이터를 카테고리별로 구분
    const raidDataByCategory: { [key: string]: SubCharacter[] } = {};
    for (const character of characterListArr) {
      const characterRaidList = checkRaidLevel(character);
      for (const raid of characterRaidList) {
        const category = raid.raidCategory;
        if (!raidDataByCategory[category]) {
          raidDataByCategory[category] = [];
        }
        raidDataByCategory[category].push({
          characterName: character.characterName,
          raidName: raid.raidName,
          raidGold: raid.raidGold,
          itemLevel: character.itemLevel, // SubCharacter에 필요한 속성 추가
          characterClass: character.characterClass, // SubCharacter에 필요한 속성 추가
        });
      }
    }

    let characterData = `[${characterServer[0].ServerName} 서버]`;

    // 각 카테고리별로 데이터를 추가
    for (const category in raidDataByCategory) {
      const categoryData = raidDataByCategory[category];
      characterData += `\n${category}:\n`;
      for (const entry of categoryData) {
        characterData += `${entry.characterName} - ${entry.raidName}: ${entry.raidGold}\n`;
      }
    }

    return characterData.trim(); // 문자열 앞뒤의 공백 제거
  } catch (error) {
    throw error; // 오류를 호출자로 던짐
  }
}

const checkRaidLevel = (character: SubCharacter) => {
  const characterRaidList = [];
  for (const raidInfo of raidData) {
    if (
      raidInfo.raidItemLevel <= character.itemLevel &&
      (raidInfo.raidItemMaxLevel === 0 ||
        character.itemLevel <= raidInfo.raidItemMaxLevel)
    ) {
      characterRaidList.push({
        raidName: raidInfo.raidName,
        raidGold: raidInfo.raidGold,
        raidCategory: raidInfo.raidCategory,
      });
    }
  }
  return characterRaidList;
};

export default weeklySupplyGold;
