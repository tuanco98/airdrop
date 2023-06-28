
import { config_TELEGRAM_ADMIN_WHITELIST } from "../../config"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script } from "../telegram"

export const airdrop_command_admin_check_request = async (message: string, username: string, chatId: string | number) => {
    try {

        if (config_TELEGRAM_ADMIN_WHITELIST.includes(username)) {
            
        } else {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.unknown_command,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.unknown_command
                })
            return
        }
    } catch (e) {
        ErrorNotification(e, { username, chatId }, airdrop_command_admin_check_request.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
    }
}