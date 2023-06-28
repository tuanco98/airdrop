import { bot_reward_paraart_copy_handle } from "./cron.bot_reward_paraart_copy_handle"
import { bot_reward_paragon_handle } from "./cron.bot_reward_paragon_handle"

export const startCron = async () => {
    try {
        await Promise.all([
            bot_reward_paraart_copy_handle(),
            bot_reward_paragon_handle()
        ])
    } catch (e) {
        throw e
    }
}
