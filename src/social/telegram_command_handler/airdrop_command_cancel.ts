
import { ErrorNotification } from "../../error_handler"
import { bot, bot_script } from "../telegram"

export const airdrop_command_cancel = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.cancel,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.cancel
            })
    } catch (e) {
        ErrorNotification(e, { userId,userFirstName, chatId }, airdrop_command_cancel.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
    }
}