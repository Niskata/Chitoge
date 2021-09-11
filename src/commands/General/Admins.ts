import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'admins',
            description: 'Tagga tutti gli admin 🎖️',
            category: 'general',
            usage: `${client.config.prefix}admins (Message)`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        return void (await M.reply(
            `ADMIN!\n[TAG NASCOSTE]`,
            undefined,
            undefined,
            M.groupMetadata?.admins
        ).catch((reason: any) => M.reply(`si è verificato un errore, Motivo: ${reason}`)))
    }
}
