import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'neko',
            description: 'Will provide you a random anime neko image',
            category: 'weeb',
            usage: `${client.config.prefix}neko`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        const rnekol = ['kemonomimi', 'neko', 'ngif', 'fox_girl']
        const rnekolc = rnekol[Math.floor(Math.random() * rnekol.length)]
        const neko = await axios.get('https://nekos.life/api/v2/img/' + rnekolc)

        return void M.reply(
            await request.buffer(neko.data.url),
            MessageType.image,
            undefined,
            undefined,
            `*🌟 Well...*`
        )
    }
}