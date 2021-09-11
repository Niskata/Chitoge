import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'delete',
            description: 'Elimina il messaggio quotato',
            aliases: ['del'],
            category: 'moderation',
            usage: `${client.config.prefix}delete`,
            adminOnly: true
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M?.quoted?.message) return void M.reply('Rispondi al messaggio che vuoi eliminare')
        if (M.quoted.sender !== this.client.user.jid) return void M.reply(`Posso eliminare solo i messaggi inviati da me`)
        await this.client.deleteMessage(M.from, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: (M.quoted.message as any).stanzaId,
            remoteJid: M.from,
            fromMe: true
        })
    }
}
