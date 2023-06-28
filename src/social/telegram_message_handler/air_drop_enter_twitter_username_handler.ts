import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_enter_twitter_username_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
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
        console.log(`${userId}-${userFirstName}: ${message}`)
        //Validate username
        const lowCaseTrimMessage = message.slice(1).toLowerCase().trim()
        if (!bot_script.validate.username(message)) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_username,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_twitter_user_name
                })
            return;
        }
        const userData = await airdropData.findOne({ twitter_username: lowCaseTrimMessage })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_use_username,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_twitter_user_name
                })
            return;
        }
        data[`${userId}`].twitter_username = lowCaseTrimMessage
        console.log({ userId: data[`${userId}`] })
        await setTeleUserStep(userId, Steps.enter_retweet_link)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.enter_retweet_link(),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_retweet_link
            })
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_enter_twitter_username_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_twitter_user_name
            })
    }
}