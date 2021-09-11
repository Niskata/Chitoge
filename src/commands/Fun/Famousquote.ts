import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'fquote',
            description: 'citazione famosa a caso.',
            aliases: ['fq'],
            category: 'fun',
            usage: `${client.config.prefix}fquote`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        await axios.get(`https://api.quotable.io/random?tags=technology,famous-quotes`)
        .then((response) => {
                // console.log(response);
                const text = `📝 *Contenuto:* ${response.data.content}\n\n*✍️ Autore:* ${response.data.author}`
                M.reply(text);
            }).catch(err => {
                M.reply(`🔍 Errore: ${err}`)
            }
            )
    };
}
