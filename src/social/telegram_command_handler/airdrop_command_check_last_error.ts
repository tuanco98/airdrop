
import { ErrorNotification, lastErrorMessage } from "../../error_handler"
import { bot, bot_script } from "../telegram"

export const airdrop_command_check_last_error = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
     
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.checkLastError(lastErrorMessage||"nothing"),
         )
    } catch (e) {
        ErrorNotification(e, { userId, userFirstName, chatId }, airdrop_command_check_last_error.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_join_telegram
            })
    }
}