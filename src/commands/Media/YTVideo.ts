import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'ytv',
            description: 'Scarica e invia il video YT specificato',
            category: 'media',
            aliases: ['ytvideo'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply(`🔎 Specifica l'url del video che vuoi scaricare`)
        const video = new YT(M.urls[0], 'video')
        if (!video.validateURL()) return void M.reply(`Invia un url valido`)
        const { videoDetails } = await video.getInfo()
        M.reply('🌟 Sending...')
        if (Number(videoDetails.lengthSeconds) > 1800)
            return void M.reply('⚓ Impossibile scaricare video più lunghi di 30 minuti')
        M.reply(await video.getBuffer(), MessageType.video).catch((reason: Error) =>
            M.reply(`✖ Errore, motivo: ${reason}`)
        )
    }
}
