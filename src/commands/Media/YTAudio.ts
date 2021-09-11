import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'yta',
            description: 'Scarica un video da YouTube e lo invia come audio',
            category: 'media',
            aliases: ['ytaudio'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply(`🔎 Specifica l'indirizzo del video che vuoi scaricare`)
        const audio = new YT(M.urls[0], 'audio')
        if (!audio.validateURL()) return void M.reply(`⚓ Fornisci un indirizzo valido`)
        M.reply('🌟 Invio in corso...')
        M.reply(await audio.getBuffer(), MessageType.audio).catch((reason: Error) =>
            M.reply(`✖ Errore, motivo: ${reason}`)
        )
    }
}
