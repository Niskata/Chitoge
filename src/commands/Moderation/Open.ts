import { GroupSettingChange } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'open',
            description: 'Apre il gruppo a tutti i partecipanti.',
            category: 'moderation',
            usage: `${client.config.prefix}open`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("Non posso aprire il gruppo se non sono admin")
            if (M.groupMetadata.announce === "false")
            return void M.reply("Il gruppo è già aperto")

        this.client.groupSettingChange(M.groupMetadata.id, GroupSettingChange.messageSend, false)
    }
}
