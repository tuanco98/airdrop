import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_welcome_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        
        console.log(`${userId}-${userFirstName}: ${message}`)
        if (message === bot_script.button_message.ready) {
            await setTeleUserStep(userId, Steps.enter_facebook_link)
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.enter_facebook_link(userFirstName),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_link
                })
            data[`${userId}`] = {}
        } else {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.unknown_command,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.unknown_command
                })
        }
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_welcome_handler.name)
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