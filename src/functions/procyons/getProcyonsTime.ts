import axios from 'axios'
import global from '../../config/config'

export const command: Record<string, string>= {
    command: global.prefix + '아바타',
    help: '[캐릭터이름]',
    description: '캐릭터 아바타를 링크를 통해 볼 수 있습니다.'
}

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
        const procyonTimetable = [];
        
        for(const tmp of data) {
            if(tmp.CategoryName === categoryName) {
                const startTime = tmp.StartTimes.filter((time) => {
                    const datetime = new Date(time);
                    const timeStamp = datetime.getTime();
                    if(nowTimeStamp < timeStamp){
                        console.log(tmp.ContentsName)
                    }
                })
            }
        }

        const characterData = `[${categoryName}] `;
        return characterData;
    } catch (error) {
        throw error; // 오류를 호출자로 던짐
    }
}

export default getProcyonsTime;