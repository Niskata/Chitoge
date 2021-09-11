import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import Spotify from '../../lib/Spotify'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'spotify',
            description: 'Scarica una canzone da spotify e la invia come audio',
            category: 'media',
            usage: `${client.config.prefix}spotify [URL]`,
            baseXp: 20,
            aliases: ['sp']
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply(`🔎 Specifica l'indirizzo della canzone che vorresti scaricare`)
        const url = M.urls[0]
        const track = new Spotify(url)
        const info = await track.getInfo()
        if (info.error) return void M.reply(`⚓ Errore ottenendo: ${url}. Controlla se l'indirizzo è giusto e prova di nuovo`)
        const caption = `🎧 *Titolo:* ${info.name || ''}\n🎤 *Artisti:* ${(info.artists || []).join(',')}\n💽 *Album:* ${
            info.album_name
        }\n📆 *Release Date:* ${info.release_date || ''}`
        M.reply(
            await request.buffer(info?.cover_url as string),
            MessageType.image,
            undefined,
            undefined,
            caption
        ).catch((reason: any) => M.reply(`✖ Errore, motivo: ${reason}`))
        M.reply(await track.getAudio(), MessageType.audio).catch((reason: any) =>
            M.reply(`✖ Errore, motivo: ${reason}`)
        )
    }
}
