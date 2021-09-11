import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'
import YT from '../../lib/YT'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'play',
            description: '🎵 riproduce una canzone solo con il termine di ricerca!',
            category: 'media',
            aliases: ['music'],
            usage: `${client.config.prefix}play [term]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('🔎 Specifica un termine di ricerca')
        const term = joined.trim()
        const { videos } = await yts(term)
        if (!videos || videos.length <= 0) return void M.reply(`⚓ Nessun video trovato per il termine: *${term}*`)
        const audio = new YT(videos[0].url, 'audio')
        if (!audio.url) return
        M.reply('🌟 Invio in corso...')
        this.client
            .sendMessage(M.from, await audio.getBuffer(), MessageType.audio, {
                quoted: M.WAMessage,
                contextInfo: {
                    externalAdReply: {
                        title: videos[0].title.substr(0, 30),
                        body: `author : ${videos[0].author.name.substr(0, 20)}\nChitogeITA 🌟`,
                        mediaType: 2,
                        thumbnailUrl: `https://i.ytimg.com/vi/${audio.id}/hqdefault.jpg`,
                        mediaUrl: audio.url
                    }
                }
            })
            .catch((reason: Error) => M.reply(`✖ Errore, motivo: ${reason}`))
    }
}
