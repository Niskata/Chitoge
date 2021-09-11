/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'retrieve',
            description: 'retrieve viewOnceMessage WhatsApp Message',
            adminOnly: true,
            category: 'misc',
            usage: `${client.config.prefix}retrieve [Tag the viewOnceMessage]`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.quoted) return void (await M.reply(`🔖 Rispondi al messaggio che vuoi ottenere`))
        if (!(M?.quoted?.message?.message as any)?.viewOnceMessage?.message?.imageMessage)
            return void M.reply(`Tagga il messaggio che vuoi ottenere\nSe stai già rispondendo ad esso, contatta il proprietario del bot e digli di aggiornare WhatsApp.`)
        return void M.reply(
            await this.client.downloadMediaMessage((M.quoted.message?.message as any).viewOnceMessage),
            MessageType.image,
            undefined,
            undefined,
            'Ecco a te. - funziona grazie a *void*'
        )
    }
}
