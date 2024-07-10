import axios from 'axios'
import global from '../../config/config'

export const command: Record<string, string>= {
    command: global.prefix + '아바타',
    help: '[캐릭터이름]',
    description: '캐릭터 아바타를 링크를 통해 볼 수 있습니다.'
}

// 모험섬 보상아이템 종류
const rewardItemTypes = ['주화', '카드', '골드'];

async function getProcyonsTime(procyonCategoryName: string) {
    const apiUrl = `${global.apiUrl.lostark}gamecontents/calendar`;

    const category = [
        { queryName: '점령', categoryName: '로웬' },
        { queryName: '항협', categoryName: '항해' },
        { queryName: '모험', categoryName: '모험 섬'},
        { queryName: '카게', categoryName: '카오스게이트' },
        { queryName: '필보', categoryName: '필드보스' },
        { queryName: '유령', categoryName: '유령선'}
    ];

    const categoryResult = category.filter((item) => item.queryName === procyonCategoryName);
    const categoryName = categoryResult[0].categoryName;
    const nowTimeStamp = new Date().getTime();

    try {
        const response = await axios.get(apiUrl, {
            headers: global.token.lostarkHeader
        });
        
        const data = response.data;
        const tempTimeTable = [];
        
        for(const tmp of data) {
            if(tmp.CategoryName === categoryName) {
                const startTime = tmp.StartTimes.map((time) => new Date(time))
                .filter((datetime) => {
                    return nowTimeStamp < datetime.getTime()
                })

                if(startTime[0] !== undefined) {
                    // console.log(`time: ${startTime[0]}, ContentsName: ${tmp.ContentsName}, Location: ${tmp.Location}, ${tmp}`)
                    const contentsName = tmp.ContentsName;
                    if(categoryName !== '모험 섬') {
                        tempTimeTable.push({time: startTime[0], ContentsName: tmp.ContentsName, Location: tmp.Location});
                    } else {
                        const islandSize = tmp.RewardItems;
                        let rewardItem = null;
                        for(let i = 0; i < islandSize.length; i++) {
                            const normalizedName = tmp.RewardItems[i].Name.trim();
                            if (
                                /전설 카드 팩 III|고급 카드 팩 III|영혼의 잎사귀/i.test(normalizedName)
                            ) {
                                rewardItem = '카드';
                                break;
                            }
                            // 위에 해당하지 않을 경우, 일반 카드 항목들을 검사합니다.
                            if (rewardItemTypes.includes(normalizedName)) {
                                rewardItem = normalizedName;
                                break;
                            }
                        }

                        if(rewardItem === null) {
                            rewardItem = '실링'
                        }

                        console.log(tmp.Location , rewardItem)
                    }
                }
            }
        }
        tempTimeTable.sort((a,b) => a.time.getTime() - b.time.getTime());

        const timeTable = [];
        tempTimeTable.map((item) => {
            if(tempTimeTable[0].time.getTime() === item.time.getTime()) {
                const scheduleDate = new Date(item.time);
                const nowDate = new Date();
                nowDate.setHours(0,0,0,0);
                scheduleDate.setHours(0,0,0,0);
                if(nowDate.getTime() === scheduleDate.getTime()) {
                    const time = item.time;
                    const contentsName = (categoryName === "항해") ? item.ContentsName.split(' : ')[1] : item.ContentsName;
                    const location = (categoryName === "항해") ? item.Location.replace('[대항해] ', '') : item.Location;

                    if(categoryName === '모험 섬') {
                        timeTable.push( );
                    }
                    else {
                        timeTable.push({ time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`, ContentsName: contentsName, Location: location})
                    }
                }
            }
        })
        let alramText = "";
        for(const tmp of timeTable) {
            const locationText = (tmp.Location !== null) ? ` : ${tmp.Location}` : '';
            alramText += `\n${tmp.ContentsName}${locationText}`;
        }
        const characterData = (timeTable.length > 0) ? `[${timeTable[0].time} ${categoryName}]${alramText}` : `오늘의 ${categoryName} 일정이 없습니다.`
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getProcyonsTime;