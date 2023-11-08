import axios from 'axios'
import global from '../../config/config'
import {apiCheck} from '../utils/apiCheck'
import { getCharacterSuspendAccount } from './getCharacterSuspendAccount';
import { init as initDb, connect as connectDb, query as queryDb } from '../../config/mysqlConf'
import Cheerio from 'cheerio'

async function getCharacterCollect(characterName: string) {
    // const apiUrl = `${global.apiUrl.lostark}armories/characters/${characterName}?filters=profiles%2Bcollectibles`;
    const lostarkHomeUrl = `https://m-lostark.game.onstove.com/Profile/Character/${characterName}`;

        const suspendAccountCheck = await getCharacterSuspendAccount(characterName);
        
        try {
            // 전투정보실 데이터를 가져온다.
            let htmlResponse = await axios.get(lostarkHomeUrl);
            let $ = Cheerio.load(htmlResponse.data);
            const isDiv = $('div.profile-wrapper').length > 0;
            const characterInfo = {
                _memberNo: null,
                _worldNo: null,
                _pcId: null,
                complete: false
            };

            if(!isDiv) {
                return `${characterName} 캐릭터 정보가 없습니다. 다시 한번 확인해주세요.`;
            } else {
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();
                    const memberNo = scriptContent.match(/var\s+_memberNo\s*=\s*'([^']+)'/);
                    const worldNo = scriptContent.match(/var\s+_worldNo\s*=\s*'([^']+)'/);
                    const pcId = scriptContent.match(/var\s+_pcId\s*=\s*'([^']+)'/);

                    const _memberNo = (memberNo && memberNo[1]) ? memberNo[1] : null;
                    const _worldNo  = (worldNo && worldNo[1]) ? worldNo[1] : null;
                    const _pcId     = (pcId && pcId[1]) ? pcId[1] : null;
                    if(_memberNo !== null && _worldNo !== null && _pcId !== null) {
                        characterInfo._memberNo = _memberNo;
                        characterInfo._worldNo = _worldNo;
                        characterInfo._pcId = _pcId;
                        characterInfo.complete = true;
                        return false;
                    }
                });

                let dataMode = await characterSearch(characterName)
                .then(res => {
                    if(Array.isArray(res) && res.length === 0) {
                        return 'insert';
                    } else {
                        const now: Date = new Date();
                        const updateTime: Date = new Date(res[0].updateTime);
                        const timeDifference = now.getTime() - updateTime.getTime();
                        const minutesDifference = timeDifference / (1000 * 60);

                        if (Array.isArray(res) && res.length > 0 && minutesDifference >= 3) { // 데이터는 존재하나 3분 이상이 지난경우
                            return 'update';
                        }
                    }
                })
                .catch(e => {throw e});
                
                if(characterInfo.complete === true) {
                    const collectUrl = 'https://lostark.game.onstove.com/Profile/GetCollection';
                    try {
                        const formData = new FormData();
                        formData.append('memberNo', characterInfo._memberNo);
                        formData.append('worldNo', characterInfo._worldNo);
                        formData.append('pcId', characterInfo._pcId);

                        const collectResponse = await axios.post(collectUrl, formData);
                        let $ = Cheerio.load(collectResponse.data);
                        // 거인의 심장
                        const heartNowCount = Number($('#lui-tab1-0 .collection-list p span.now-count').text());
                        const heartMaxCount = Number($('#lui-tab1-0 .collection-list p span.max-count').text());
                        const heartComplete = (heartMaxCount === heartNowCount) ? 1 : 0;
                        const heartData = [];
                        $('#lui-tab1-0 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');
                            
                            if(hasCompleteClass) heartData.push('1');
                            else heartData.push('0');
                        })

                        // 섬의 마음
                        const isLandNowCount = Number($('#lui-tab1-1 .collection-list p span.now-count').text());
                        const isLandMaxCount = Number($('#lui-tab1-1 .collection-list p span.max-count').text());
                        const isLandComplete = (isLandNowCount === isLandMaxCount) ? 1 : 0;
                        const isLandData = [];
                        $('#lui-tab1-1 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) isLandData.push('1');
                            else isLandData.push('0');
                        });

                        // 모코코 씨앗
                        const seedsNowCount = Number($('#lui-tab1-2 .collection-list ul li span em span').text());
                        const seedsMaxCount = Number($('#lui-tab1-2 .collection-list ul li span em span').text());
                        const seedsComplete = (seedsNowCount === seedsMaxCount) ? 1 : 0;
                        const seedsData = [];
                        $('#lui-tab1-2 .collection-list ul.list li').each((i, e) => {
                            const seedNowCount = $(e).find('em span').eq(0).text();
                            seedsData.push(seedNowCount);
                        });

                        // 위대한 미술품
                        const artworkNowCount = Number($('#lui-tab1-3 .collection-list p span.now-count').text());
                        const artworkMaxCount = Number($('#lui-tab1-3 .collection-list p span.max-count').text());
                        const artworkComplete = (artworkNowCount === artworkMaxCount) ? 1 : 0;
                        const artworkData = [];
                        $('#lui-tab1-3 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) artworkData.push('1');
                            else artworkData.push('0');
                        });

                        // 항해 모험물
                        const voyageNowCount = Number($('#lui-tab1-4 .collection-list p span.now-count').text());
                        const voyageMaxCount = Number($('#lui-tab1-4 .collection-list p span.max-count').text());
                        const voyageComplete = (voyageNowCount === voyageMaxCount) ? 1 : 0;
                        const voyageData = [];
                        $('#lui-tab1-4 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) voyageData.push('1');
                            else voyageData.push('0');
                        });

                        // 세계수의 잎
                        const worldTreeNowCount = Number($('#lui-tab1-5 .collection-list p span.now-count').text());
                        const worldTreeMaxCount = Number($('#lui-tab1-5 .collection-list p span.max-count').text());
                        const worldTreeComplete = (worldTreeNowCount === worldTreeMaxCount) ? 1 : 0;
                        const worldTreeData = [];
                        $('#lui-tab1-5 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) worldTreeData.push('1');
                            else worldTreeData.push('0');
                        });

                        // 이그네아의 징표
                        const ignareNowCount = Number($('#lui-tab1-6 .collection-list p span.now-count').text());
                        const ignareMaxCount = Number($('#lui-tab1-6 .collection-list p span.max-count').text());
                        const ignareComplete = (ignareNowCount === ignareMaxCount) ? 1 : 0;
                        const ignareData = [];
                        $('#lui-tab1-6 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) ignareData.push('1');
                            else ignareData.push('0');
                        });

                        // 오르페우스의 별
                        const starNowCount = Number($('#lui-tab1-7 .collection-list p span.now-count').text());
                        const starMaxCount = Number($('#lui-tab1-7 .collection-list p span.max-count').text());
                        const starComplete = (starNowCount === starMaxCount) ? 1 : 0;
                        const starData = [];
                        $('#lui-tab1-7 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) starData.push('1');
                            else starData.push('0');
                        });

                        // 기억의 오르골
                        const musicboxNowCount = Number($('#lui-tab1-8 .collection-list p span.now-count').text());
                        const musicboxMaxCount = Number($('#lui-tab1-8 .collection-list p span.max-count').text());
                        const musicboxComplete = (musicboxNowCount === musicboxMaxCount) ? 1 : 0;
                        const musicboxData = [];
                        $('#lui-tab1-8 .collection-list ul.list li').each((i, e) => {
                            const hasCompleteClass = $(e).hasClass('complete');

                            if(hasCompleteClass) musicboxData.push('1');
                            else musicboxData.push('0');
                        });

                        // 각 배열을 일반 문자열화
                        const heart = heartData.join('|');
                        const island = isLandData.join('|');
                        const seeds = seedsData.join('|');
                        const artworks = artworkData.join('|');
                        const voyage = voyageData.join('|');
                        const worldtree = worldTreeData.join('|');
                        const ignare = ignareData.join('|');
                        const star = starData.join('|');
                        const musicbox = musicboxData.join('|');

                        // 내실정보 간략
                        const shortInfoArr = $('.lui-tab__menu').html().replace(/\n/, '').split('</a>').map(item => item.replace(global.regex.htmlEntity, ''));
                        shortInfoArr.pop();

                        const shortInfo = shortInfoArr.join(', ');

                        if(dataMode === 'insert') characterInsert(characterName, shortInfo, heart, heartComplete, island, isLandComplete, seeds, seedsComplete, artworks, artworkComplete, voyage, voyageComplete, worldtree, worldTreeComplete, ignare, ignareComplete, star, starComplete, musicbox, musicboxComplete);
                        else characterUpdate(characterName, shortInfo, heart, heartComplete, island, isLandComplete, seeds, seedsComplete, artworks, artworkComplete, voyage, voyageComplete, worldtree, worldTreeComplete, ignare, ignareComplete, star, starComplete, musicbox, musicboxComplete);

                        return characterSearch(characterName);
                    } catch (error) {
                        return 'error';
                    }
                }
            }
        } catch (error) {
            return error;
         }
}



async function getCharacterCollectText(characterName, content = null) {
    const commandTitle = `${characterName}님의 ${content === null ? '내실' : content}정보\n`;
    const apiStatus = await apiCheck();
    let apiData = null;
    const characterData = [];
    let collectsTotal = 0;
    let collectsNow = 0;

    if (apiStatus === true) {
        try {
            const characterResult = await characterSearch(characterName);

            if (Array.isArray(characterResult) && characterResult.length === 0) {
                await getCharacterCollect(characterName);
            } else {
                const data = characterResult[0];
                const now = new Date();
                const updateTime = new Date(data.updateTime);
                const timeDifference = now.getTime() - updateTime.getTime();
                const minutesDifference = timeDifference / (1000 * 60);

                if (Array.isArray(characterResult) && characterResult.length > 0 && minutesDifference >= 3) {
                    await getCharacterCollect(characterName);
                }
            }

            const updateRes = await characterSearch(characterName);
            apiData = updateRes[0];
        } catch (error) {
            console.error(error);
        }
        const examCommand = returnCollect(content);

        if (examCommand === null) {
            return `${commandTitle}${apiData.collect_text}`;
        } else if (examCommand !== null) {
            const db = await collectData(examCommand);
            const collectDataKey = `collect_${examCommand.toLowerCase()}_count`;
            if (apiData && typeof apiData === 'object') {                
                if (collectDataKey in apiData) {
                    
                    const collectDataArray = apiData[collectDataKey].split('|');
                    let i = 0;
                    for (const collectItem of db) {
                        if(examCommand !== "MOKOKOSEEDS") {
                            const isCollected = collectDataArray[i] === '0' ? '미획득' : '획득';
                            collectsTotal++;
                            if(collectDataArray[i] !== '0') collectsNow++;
                            characterData.push(`${collectItem.collect_name}: ${isCollected}`);
                        } else {
                            collectsTotal += collectItem.collect_max;
                            collectsNow += parseInt(collectDataArray[i]);
                            characterData.push(`${collectItem.collect_name}: ${collectDataArray[i]}/${collectItem.collect_max}`);
                        }
                        i++;
                    }
                } else {
                    console.error(`Error: ${collectDataKey} is not a property in apiData.`);
                }
            } else {
                console.error(`Error: apiData is undefined or not an object.`);
            }
        }

        return `${commandTitle}\n[획득정보]\n${collectsNow}/${collectsTotal}\n---상세정보는 전체보기---\n\n[상세내용]\n${characterData.join('\n')}`;
    } else {
        const characterResult = await characterSearch(characterName);

        if (Array.isArray(characterResult) && characterResult.length === 0) {
            return '[안내] 데이터를 가져올 수 없습니다. (이유: 서비스 점검시간)';
        } else {
            const data = characterResult[0];

            if (content === null) {
                return `${characterName}님의 내실정보\n${data.collect_text}`;
            }
        }
    }
}



// 캐릭터명 조회, 만약 없는경우 return 0
const characterSearch = async (characterName: string) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const selectQuery = 'SELECT * FROM LOA_CHARACTER_COLLECT WHERE characterName = ?';
        const selectValues = [characterName];
        const result = await queryDb(conn, selectQuery, selectValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 캐릭터명 insert
const characterInsert = async (characterName, textdata, heartData, heartStu, islandData, isLandStu, seedData, seedStu, artData, artStu, voyageData, voyageStu, treeData, treeStu, ignareData, ignareStu, starData, starStu, musicData, musicStu) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const insertColumns = '(characterName, collect_text, collect_heartofgiant_count, collect_heartofgiant_complete, collect_island_count, collect_island_complete, collect_mokokoseeds_count, collect_mokokoseeds_complete, ' +
                              'collect_artwark_count, collect_artwork_complete, collect_voyageadventure_count, collect_voyageadventure_complete, collect_theworldtreeleaves_count, collect_theworldtreeleaves_complete, ' + 
                              'collect_ignaismark_count, collect_ignaismark_complete, collect_orpheusstar_count, collect_orpheusstar_complete, collect_memorymusicbox_count, collect_memorymusicbox_complete, registDate, isSuspend, isDelete, upDatetime)';
        const insertQuery = 'INSERT INTO LOA_CHARACTER_COLLECT ' + insertColumns + ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),0,0,NOW())';
        const insertValues = [characterName, textdata, heartData, heartStu, islandData, isLandStu, seedData, seedStu, artData, artStu, voyageData, voyageStu, treeData, treeStu, ignareData, ignareStu, starData, starStu, musicData, musicStu];
        const result = await queryDb(conn, insertQuery, insertValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 캐릭터명 update
const characterUpdate = async (characterName, textdata, heartData, heartStu, islandData, isLandStu, seedData, seedStu, artData, artStu, voyageData, voyageStu, treeData, treeStu, ignareData, ignareStu, starData, starStu, musicData, musicStu) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        const updateQuery = 'UPDATE LOA_CHARACTER_COLLECT SET collect_text = ?, collect_heartofgiant_count = ?, collect_heartofgiant_complete = ?, collect_island_count = ?, collect_island_complete = ?, collect_mokokoseeds_count = ?, collect_mokokoseeds_complete = ?,' +
                            'collect_artwark_count = ?, collect_artwork_complete = ?, collect_voyageadventure_count = ?, collect_voyageadventure_complete = ?, collect_theworldtreeleaves_count = ?, collect_theworldtreeleaves_complete = ?,' +
                            'collect_ignaismark_count = ?, collect_ignaismark_complete = ?, collect_orpheusstar_count = ?, collect_orpheusstar_complete = ?, collect_memorymusicbox_count = ?, collect_memorymusicbox_complete = ?, updateTime = NOW() ' +
                            'WHERE characterName = ?';
        const updateValues = [textdata, heartData, heartStu, islandData, isLandStu, seedData, seedStu, artData, artStu, voyageData, voyageStu, treeData, treeStu, ignareData, ignareStu, starData, starStu, musicData, musicStu, characterName];
        const result = await queryDb(conn, updateQuery, updateValues);
        return result;
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 내실 상세내용
const collectData = async (tableName) => {
    const conn = initDb();
    await connectDb(conn);
    try {
        if(tableName !== 'MOKOKOSEEDS') {
            const selectQuery = 'SELECT collect_name FROM LOA_COLLECT_' + tableName +' ORDER BY collect_id ASC';
            const result = await queryDb(conn, selectQuery);
            return result;
        } else {
            const selectQuery = 'SELECT collect_name, collect_max FROM LOA_COLLECT_' + tableName +' ORDER BY collect_id ASC';
            const result = await queryDb(conn, selectQuery);
            return result;
        }
    } catch (error) {
        console.error('Query execution failed:', error);
        return null;
    } finally {
        conn.end();
    }
}

// 명령어
function returnCollect(collectName) {
    switch(collectName) {
        case "거인의심장":
        case "거심":
        case "심장":
            return "HEARTOFGIANT";
        case "섬의마음":
        case "섬마":
            return "ISLAND";
        case "모코코":
        case "모코코씨앗":
        case "씨앗":
            return "MOKOKOSEEDS";
        case "위대한미술품":
        case "미술품":
            return "ARTWORK";
        case "항해":
        case "모험물":
        case "항해모험물":
            return "VOYAGEADVENTURE";
        case "세계수의잎":
        case "세계수":
            return "THEWORLDTREELEAVES";
        case "이그네아의징표":
        case "이그네아":
        case "징표":
            return "IGNAISMARK";
        case "오르페우스의별":
        case "오페별":
            return "ORPHEUSSTAR";
        case "기억의오르골":
        case "오르골":
            return "MEMORYMUSICBOX";
        default:
            return null;
    }
}

export default getCharacterCollectText;
