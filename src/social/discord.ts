import { Client, Guild } from "discord.js"
import { successConsoleLog } from "../color-log"
import { config_DISCORD_BOT_TOKEN, config_PROJECT_DISCORD_SERVER_ID } from "../config"
const AsynchronousStep = {
    login: "login"
}

let discord_client: Client
let guild: Guild | undefined
export const initDiscordBot = async () => {
    try {
        const bot_token = config_DISCORD_BOT_TOKEN
        const response: any = {}
        discord_client = new Client()
        response[AsynchronousStep.login] = await discord_client.login(bot_token)
    //    console.log(discord_client.guilds.cache)
        guild = discord_client.guilds.cache.get(config_PROJECT_DISCORD_SERVER_ID)
        if (!guild) throw new Error(`Discord bot did not added to server`)
        successConsoleLog(`🚀 Discord bot: ready`)
    } catch (e) {
        throw e
    }
}

export const checkJoinDiscordServer = async (user_id: string) => {
    try {
        const isMember = await guild?.members.fetch(user_id)
        if (isMember) {
            console.log(`${user_id}-${isMember.user.username} is our member`)
            return true
        }
        return false
    } catch (e) {
        console.log(e)
        console.log(`${user_id} is not our member`)
        return false
    }
}