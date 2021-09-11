import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'everyone',
            description: 'Tagga tutti gli utenti in una chat',
            aliases: ['all', 'tagall'],
            category: 'moderation',
            usage: `${client.config.prefix}everyone`,
            adminOnly: true
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        return void (await M.reply(
            `${M.groupMetadata?.subject || 'EVERYONE'}\n*[TAG NASCOSTE]*`,
            undefined,
            undefined,
            M.groupMetadata?.participants.map((user) => user.jid)
        ).catch((reason: any) => M.reply(`✖ Un errore si è verificato, Motivo: ${reason}`)))
    }
}
