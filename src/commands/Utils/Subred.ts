import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import redditFetcher, { IRedditResponse } from '../../lib/redditFetcher'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'subred',
            description: 'Invia post da reddit',
            aliases: ['sr', 'reddit'],
            category: 'utils',
            usage: `${client.config.prefix}subred [subredit_name]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void (await M.reply(`Per favore specifica la subreddit`))
        const response = await redditFetcher(joined.toLowerCase().trim())
        if ((response as { error: string }).error) return void (await M.reply('Subreddit non trovata o non valida'))
        const res = response as IRedditResponse
        if (res.nsfw && !(await this.client.getGroupData(M.from)).nsfw)
            return void M.reply(
                `Impossibile mostrare contenuti NSFW prima di abilitarli. Usa ${this.client.config.prefix}activate NSFW per attivarli.`
            )
        const thumbnail = this.client.assets.get('spoiler')
        const notFound = this.client.assets.get('404')
        const buffer = await request.buffer(res.url)
        .catch((e) => {
            if (e.message.includes('marker not found')){
                this.run(this.run.arguments[0], this.run.arguments[1])
            }
            if (e.message.includes('filter type')){
                this.run(this.run.arguments[0], this.run.arguments[1])
            }
            return void M.reply(e.message)
        }
        )
        M.reply(
            buffer || notFound || `Impossibile ottenere l'immagine. Prova più tardi`,
            MessageType.image,
            undefined,
            undefined,
            `🖌️ *Titolo: ${res.title}*\n*👨‍🎨 Autore: ${res.author}*\n*🎏 Subreddit: ${res.subreddit}*\n🌐 *Post: ${res.postLink}*`,
            // thumbnail && res.spoiler ? thumbnail : undefined
            undefined
        ).catch(e => {
            return void M.reply(`Si è verificato un errore. Motivo: ${e.message}`)
        })
        return void null
    }
}
