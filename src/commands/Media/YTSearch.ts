import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'yts',
            description: 'Cerca su YT',
            category: 'media',
            aliases: ['ytsearch'],
            usage: `${client.config.prefix}yts [term]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('š Specifica un termine di ricerca')
        const term = joined.trim()
        const { videos } = await yts(term)
        if (!videos || videos.length <= 0) return void M.reply(`ā Nessun video trovato per: *${term}*`)
        const length = videos.length < 10 ? videos.length : 10
        let text = `š *Results for ${term}*\n`
        for (let i = 0; i < length; i++) {
            text += `*#${i + 1}*\nš *Titolo:* ${videos[i].title}\nš *Canale:* ${
                videos[i].author.name
            }\n š *Durata:* ${videos[i].duration}\nš *URL:* ${videos[i].url}\n\n`
        }
        M.reply('š Ricerca...')
        this.client
            .sendMessage(M.from, text, MessageType.extendedText, {
                quoted: M.WAMessage,
                contextInfo: {
                    externalAdReply: {
                        title: `Termine di ricerca: ${term}`,
                        body: `š Chitoge-ITA š`,
                        mediaType: 2,
                        thumbnailUrl: videos[0].thumbnail,
                        mediaUrl: videos[0].url
                    }
                }
            })
            .catch((reason: any) => M.reply(`ā Errore, motivo: ${reason}`))
    }
}
