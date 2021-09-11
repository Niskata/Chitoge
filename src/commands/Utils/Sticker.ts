import { MessageType, Mimetype } from '@adiwajshing/baileys'
import { Sticker, Categories } from 'wa-sticker-formatter'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'sticker',
            description: 'Converte immagini/foto in stickers',
            category: 'utils',
            usage: `${client.config.prefix}sticker [(as caption | tag)[video | image]]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        let buffer
        if (M.quoted?.message?.message?.imageMessage)
            buffer = await this.client.downloadMediaMessage(M.quoted.message)
        else if (M.WAMessage.message?.imageMessage)
            buffer = await this.client.downloadMediaMessage(M.WAMessage)
        else if (M.quoted?.message?.message?.videoMessage)
            return void M.reply(`*Gif/Video to Sticker* non è ancora abilitata.\nPuoi comunque usare il comando con foto statiche!!`)
            // buffer = await this.client.downloadMediaMessage(M.quoted.message)
        else if (M.WAMessage.message?.videoMessage)
            return void M.reply(`*Gif/Video to Sticker* non è ancora abilitata.\nPuoi comunque usare il comando con foto statiche!!`)
            // buffer = await this.client.downloadMediaMessage(M.WAMessage)
        if (!buffer) return void M.reply(`Non hai specificato alcuna foto/video da convertire`)
        // flags.forEach((flag) => (joined = joined.replace(flag, '')))
        parsedArgs.flags.forEach((flag) => (parsedArgs.joined = parsedArgs.joined.replace(flag, '')))
        const pack = parsedArgs.joined.split('|')
        const categories = (() => {
            const categories = parsedArgs.flags.reduce((categories, flag) => {
                switch (flag) {
                    case '--angry':
                        categories.push('💢')
                        break
                    case '--love':
                        categories.push('💕')
                        break
                    case '--sad':
                        categories.push('😭')
                        break
                    case '--happy':
                        categories.push('😂')
                        break
                    case '--greet':
                        categories.push('👋')
                        break
                    case '--celebrate':
                        categories.push('🎊')
                        break
                }
                return categories
            }, new Array<Categories>())
            categories.length = 2
            if (!categories[0]) categories.push('❤', '🌹')
            return categories
        })()
        const sticker = new Sticker(buffer, {
            categories,
            pack: pack[1] || '🌟 Ecco a te ',
            author: pack[2] || 'Chitoge/Alessandro 🌟',
            type: parsedArgs.flags.includes('--crop') || parsedArgs.flags.includes('--c') ? 'crop' : parsedArgs.flags.includes('--stretch') || parsedArgs.flags.includes('--s') ? 'default' : 'full'
        })
        await M.reply(await sticker.build(), MessageType.sticker, Mimetype.webp)
    }
}
