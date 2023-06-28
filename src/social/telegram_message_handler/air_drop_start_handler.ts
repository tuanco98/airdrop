import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script, Steps } from "../telegram"

export const air_drop_start_handler = async (userId: string, userFirstName: string, chatId: string | number) => {
    try {
        console.log(`${userId}-${userFirstName}: start`)
        const userData = await airdropData.findOne({ telegram_id: userId })
        if (userData) {
            if (userData.txid) {
                await setTeleUserStep(userId, Steps.finish)
                bot.telegram.sendMessage(chatId, bot_script.message.finish(userData), {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                })
                return
            }
            if (userData.acceptedAt) {
                await setTeleUserStep(userId, Steps.active_status)
                bot.telegram.sendMessage(chatId, bot_script.message.ending(userFirstName, userData), {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    // reply_markup:bot_script.reply_markup.active
                })
                return
            }
            await setTeleUserStep(userId, Steps.pending_status)
            bot.telegram.sendMessage(chatId, bot_script.message.pending(userFirstName), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.pending
            })
            return
        }
        await setTeleUserStep(userId, Steps.welcome)
        bot.telegram.sendMessage(chatId, bot_script.message.welcome(userFirstName), {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: bot_script.reply_markup.welcome
        })
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { userId, userFirstName, chatId }, air_drop_start_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.welcome
            })
    }
}