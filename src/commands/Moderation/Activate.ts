import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient, { toggleableGroupActions } from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'activate',
            aliases: ['act'],
            description: 'attiva alcune funzioni nei gruppi',
            category: 'moderation',
            usage: `${client.config.prefix}activate [feature]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        const type = joined.trim().toLowerCase() as toggleableGroupActions
        if (!Object.values(toggleableGroupActions).includes(type))
            return void M.reply(`🟥 Opzione non valida: *${this.client.util.capitalize(type)}*`)
        const data = await this.client.getGroupData(M.from)
        if (data[type]) return void M.reply(`🟨 *${this.client.util.capitalize(type)}* è già attivo`)
        await this.client.DB.group.updateOne({ jid: M.from }, { $set: { [type]: true } })
        return void M.reply(`🟩 *${this.client.util.capitalize(type)}* è ora attivo`)
    }
}
