import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'demote',
            description: 'retrocede la persona taggata',
            category: 'moderation',
            usage: `${client.config.prefix}demote [mention | @tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`✖ Impossibile retrocedere perché non sono admin`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`Per favore tagga la persona che vuoi retrocedere`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (!M.groupMetadata?.admins?.includes(user)) M.reply(`✖ Skippato *${username}* perché non è admin`)
            else if (user !== this.client.user.jid) {
                await this.client.groupDemoteAdmin(M.from, [user])
                M.reply(`➰ Retrocesso correttamente *${username}*`)
            }
        })
    }
}
