import {  setTeleUserStep } from "../../cache"
import { config_ADMIN_KEY, config_NODE_ENV } from "../../config"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script, Steps } from "../telegram"

export const air_drop_finish_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        console.log(`${userId}-${userFirstName}: ${message}`)
       
        if (message === `restart-${config_ADMIN_KEY}` && config_NODE_ENV.includes("dev")) {
            await airdropData.findOneAndDelete({ telegram_id: userId })
          
            await bot.telegram.sendMessage(chatId, "hidden command trigger! type /start to restart process!", {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
            return
        }
        const userData = await airdropData.findOne({ telegram_id: userId })
        if (!userData) throw new Error(`abc`)
        await setTeleUserStep(userId, Steps.finish)
        bot.telegram.sendMessage(chatId, bot_script.message.finish(userData), {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
        })
        return
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_finish_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
    }
}