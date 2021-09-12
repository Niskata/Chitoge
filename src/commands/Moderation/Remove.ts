import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            aliases: ['boom', 'kick'],
            command: 'remove',
            description: 'rimuove la persona menzionata',
            category: 'moderation',
            usage: `${client.config.prefix}remove [@mention | tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`✖ Impossibile rimuovere perché non sono admin`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`Per favore tagga le persona che vuoi rimuovere`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (M.groupMetadata?.admins?.includes(user)) M.reply(`✖ Skippato *${username}* perché è già rimosso oppure è un amministratore`)
            else {
                await this.client.groupRemove(M.from, [user])
                M.reply(`🏌️‍♂️Rimosso con successo *${username}*`)
            }
        })
    }
}
