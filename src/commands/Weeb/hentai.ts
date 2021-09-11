import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import  axios  from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'hentai',
            description: 'Invia un hentai a caso',
            category: 'weeb',
            usage: `${client.config.prefix}hentai`,

        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
      
        const rnekol = ["waifu"];
        const rnekolc = rnekol[Math.floor(Math.random() * rnekol.length)];
        const neko = await axios.get('https://api.waifu.pics/nsfw/' + rnekolc)

return void M.reply(await request.buffer(neko.data.url), MessageType.image, undefined, undefined, `*🌟 Ecco a te, e non abusarne ;)*`)



    }








}
