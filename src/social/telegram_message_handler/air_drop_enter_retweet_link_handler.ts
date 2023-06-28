
import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { getTweetIdFromLink, getUsernameFromLink, isValidRetweetLink } from "../../utils"
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_enter_retweet_link_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
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
        data[`${userId}`].retweet_link = message
        console.log({ userId: data[`${userId}`] })
        console.log(`${userId}-${userFirstName}: ${message}`)
        if (isValidRetweetLink(message) && data[`${userId}`].twitter_username === getUsernameFromLink(message)) {
            const retweet_id = getTweetIdFromLink(message)
            const isReuseRetweet = await airdropData.findOne({ retweet_id })
            if (isReuseRetweet) {
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.in_use_link,
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_retweet_link
                    })
                return
            }
            await setTeleUserStep(userId, Steps.enter_discord_username)
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.enter_discord_username(),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_discord_username
                })
            data[`${userId}`].retweet_id = retweet_id
        } else {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_link(data[`${userId}`].twitter_username),
                {
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_retweet_link
                })
        }
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_enter_retweet_link_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_retweet_link
            })
    }
}