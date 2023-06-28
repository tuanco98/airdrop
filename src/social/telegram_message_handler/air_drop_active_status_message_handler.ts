import { ErrorNotification } from "../../error_handler"
import { bot, bot_script } from "../telegram"

export const air_drop_active_status_message_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.ending(userFirstName),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                // reply_markup: bot_script.reply_markup.active
            })
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_active_status_message_handler.name)
    }
}