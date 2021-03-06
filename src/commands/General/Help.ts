import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ICommand, IParsedArgs, ISimplifiedMessage } from '../../typings'
import { MessageType } from '@adiwajshing/baileys'
import request from '../../lib/request'


export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'help',
            description: 'Mostra il menu help o mostra le informazioni sul comando specificato',
            category: 'general',
            usage: `${client.config.prefix}help (command_name)`,
            aliases: ['menu']
        })
    }

    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        if (!parsedArgs.joined) {
            const commands = this.handler.commands.keys()
            const categories: { [key: string]: ICommand[] } = {}
            for (const command of commands) {
                const info = this.handler.commands.get(command)
                if (!command) continue
                if (!info?.config?.category || info.config.category === 'dev') continue
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info)
                else {
                    categories[info.config.category] = []
                    categories[info.config.category].push(info)
                }
            }
            let text = `š *Lista Comandi di ChitogeITA* š\n\n`
            const keys = Object.keys(categories)
            for (const key of keys)
                text += `${this.emojis[keys.indexOf(key)]} *${this.client.util.capitalize(key)}*\nā \`\`\`${categories[
                    key
                ]
                    .map((command) => command.config?.command)
                    .join(', ')}\`\`\`\n\n`
            return void M.reply(
                `${text} šļø *Nota: Usa ${this.client.config.prefix}help <nome_comando> per vedere le informazioni sul comando*`
            )
        }
        const key = parsedArgs.joined.toLowerCase()
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void M.reply(`No Command of Alias Found | "${key}"`)
        const state = await this.client.DB.disabledcommands.findOne({ command: command.config.command })
        M.reply(
            `š *Comando:* ${this.client.util.capitalize(command.config?.command)}\nšļø *Stato:* ${
                state ? 'Disabled' : 'Available'
            }\nš *Categoria:* ${this.client.util.capitalize(command.config?.category || '')}${
                command.config.aliases
                    ? `\nš„ *Aliases:* ${command.config.aliases.map(this.client.util.capitalize).join(', ')}`
                    : ''
            }\nš *Solo Gruppi:* ${this.client.util.capitalize(
                JSON.stringify(!command.config.dm ?? true)
            )}\nš *Utilizzo:* ${command.config?.usage || ''}\n\nš *Descrizione:* ${command.config?.description || ''}`
        )
    }

    emojis = ['š', 'š“', 'š®', 'š', 'š', 'āļø', 'š']
}
