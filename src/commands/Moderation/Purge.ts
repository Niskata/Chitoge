import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'purge',
            description: 'Rimuove tutti i membri di un gruppo',
            category: 'moderation',
            usage: `${client.config.prefix}purge`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (
            M.groupMetadata?.owner !== M.sender.jid &&
            M.groupMetadata?.owner !== M.sender.jid.replace('s.whatsapp.net', 'c.us')
        )
            M.reply('Solo il proprietario del gruppo può usare questo comando')
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("I can't remove without being an admin")
        if (!this.purgeSet.has(M.groupMetadata?.id || '')) {
            this.addToPurge(M.groupMetadata?.id || '')
            return void M.reply(
                "Sei sicuro? Questo rimuoverà tutti i membri del gruppo. Scrivi di nuovo il comando se vuoi continuare"
            )
        }
        M.groupMetadata.participants.map(async (user) => {
            if (!user.isAdmin) await this.client.groupRemove(M.from, [user.jid])
        })
        await M.reply('Fatto!')
        this.client.groupLeave(M.from)
    }

    purgeSet = new Set<string>()

    addToPurge = async (id: string): Promise<void> => {
        this.purgeSet.add(id)
        setTimeout(() => this.purgeSet.delete(id), 60000)
    }
}
