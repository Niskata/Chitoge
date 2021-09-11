import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'chitoge',
            description: 'Mostra le informazioni',
            category: 'misc',
            usage: `${client.config.prefix}chitoge`,
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {




return void M.reply(await request.buffer('https://i.pinimg.com/736x/ca/e7/8a/cae78ad7f8e6459ad20bde350e2eb78b.jpg'),
MessageType.image,
            undefined,
            undefined,
            `*Chitoge-ITA 🌟* \n\n🍀 *Descrizione:* Fork mantenuta e tradotta da alpha4041\n\n🌐 *URL:* https://github.com/Alpha4041/Chitoge#readme\n\n📂 *Repository:* https://github.com/Alpha4041/Chitoge`


)


    }







}
