import { errorConsoleLog, successConsoleLog } from "./color-log"
import { connectMongo, mongo } from "./mongo"
import { initRedis, redis } from "./redis"
import { initDiscordBot } from "./social/discord"
import { bot, initTelegramBot } from "./social/telegram"
import { connectGoogle } from "./social/youtube"
export const check_status = async (not_first_run?: boolean) => {
    try {
        console.log("========================")
        if (!not_first_run) {
            successConsoleLog("SERVER STARTING")
            await Promise.all([
                initRedis(),
                connectMongo(),
                initDiscordBot(),
                connectGoogle()
            ])
            await initTelegramBot()
            return
        }
        const mongo_connect_status = await mongo?.isConnected()
        const redis_connect_status = await redis?.ping()
        const telegram_connect_status = bot.botInfo ? true : false

        successConsoleLog("CHECK SERVER HEALTH")
        if (!mongo_connect_status) {
            errorConsoleLog("❌ mongo is disconnected. Try to reconnect ...")
            await connectMongo()
        } else {
            successConsoleLog("mongo")
        }
        if (!redis_connect_status) {
            errorConsoleLog("❌ redis is disconnected. Try to reconnect ...")
            await initRedis()
        } else {
            successConsoleLog("redis")
        }
        if (!telegram_connect_status) {
            errorConsoleLog("❌ telegram bot is disconnected. Try to reconnect ...")
            await initTelegramBot()
        } else {
            successConsoleLog("telegram")
        }
    } catch (e) {
        console.log(e)
    } finally {
        setTimeout(() => check_status(true), 60000)
    }
}