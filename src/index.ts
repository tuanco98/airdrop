import { initGraphQLServer } from "./apollo"
import { successConsoleLog } from "./color-log"
import { ENABLE_BOT_REWARD_PARAART_COPY, ENABLE_BOT_REWARD_PARAGON, MONGO_URI } from "./config"
import { startCron } from "./cron"
import { TypeBot } from "./models/TypeCommon"
import { connectMongo } from "./mongodb"
import { connectRedis } from "./redis"
import { initDBDeploy } from "./service/initDBDeploy"
import { connectWeb3 } from "./web3"

export let enable_bot_reward_paragon: boolean
export let enable_bot_reward_paraart_copy: boolean
;(async () => {
    try {
        enable_bot_reward_paraart_copy = JSON.parse(ENABLE_BOT_REWARD_PARAART_COPY)
        enable_bot_reward_paragon = JSON.parse(ENABLE_BOT_REWARD_PARAGON)
        await connectMongo(MONGO_URI)
        await connectRedis()
        await connectWeb3()
        await initGraphQLServer()
        await initDBDeploy()
        await startCron()
    } catch (e) {
        throw e
    }
})()
export const enableBotReward = (type_bot: TypeBot, enable: boolean) => {
    return type_bot === TypeBot.reward_paraart_copy
        ? (enable_bot_reward_paraart_copy = enable)
        : (enable_bot_reward_paragon = enable)
}
