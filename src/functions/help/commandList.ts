import global from '../../config/config'
import { command as characterInfoCommand } from '../character/getCharacterInfoText'
import { command as characterAvatarCommand } from '../character/getCharacterAvatarText'
import { command as characterCardcommand } from '../character/getCharacterCardText';

const command: Record<string, string>= {
    command: global.prefix + '캐릭터',
    help: '전체 명령어를 볼 수 있습니다.'
}

const commandListArr : Object[] = [
    command, characterInfoCommand, characterAvatarCommand, characterCardcommand
];

const CommandList = () => {
    const commandInfo = [];
    commandListArr.map((item:any, key:number) =>{
        commandInfo.push(`(${key}) ${item.command}: ${item.description} (사용방법: ${item.command} ${item.help})`);
    })
    return `모코코가 제공하는 다양한 군검봇 명령어 일람\n\n${commandInfo.join('\n')}`
}

export default CommandList