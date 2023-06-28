import { setTeleUserStep } from "../../cache"
import { config_PROJECT_TELEGRAM_CHANNEL_ID, config_PROJECT_TELEGRAM_GROUP_ID } from "../../config"
import { ErrorNotification } from "../../error_handler"
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_confirm_join_telegram_group_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        console.log(`${userId}-${userFirstName}: ${message}`)
        if (!data[`${userId}`]) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.error_missing_data,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                })
            await setTeleUserStep(userId, Steps.welcome)
            bot.telegram.sendMessage(chatId, bot_script.message.welcome(userFirstName), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.welcome
            })
            return
        }
        if (message === bot_script.button_message.confirm_join) {
            const roleInGroup = (await bot.telegram.getChatMember(config_PROJECT_TELEGRAM_GROUP_ID, Number(userId))).status
            const roleInChannel = (await bot.telegram.getChatMember(config_PROJECT_TELEGRAM_CHANNEL_ID, Number(userId))).status
            const isMemberOfGroup = ["member", "administrator", "creator"].includes(roleInGroup)
            const isMemberOfChannel = ["member", "administrator", "creator"].includes(roleInChannel)
            if (!isMemberOfGroup || !isMemberOfChannel) {
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.must_join_warning(),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_join_telegram
                    })
                return
            }
            await setTeleUserStep(userId, Steps.enter_twitter_username)
            await bot.telegram.sendMessage(
                chatId,
                bot_script.RequireFollowTwitter(),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_twitter_user_name
                })
            return
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
    } catch (e: any) {
        console.log(e?.response.description)
        if (e.response.description === "Bad Request: user not found") {

            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.must_join_warning(),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_join_telegram
                })
            return
        } else {
            ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_confirm_join_telegram_group_handler.name)
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
}