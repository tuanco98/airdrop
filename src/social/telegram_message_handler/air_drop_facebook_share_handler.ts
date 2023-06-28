import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { getPostIdFromFacebookShareLink, getUserIdFromFacebookShareLink } from "../../utils";
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_facebook_share_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
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
        //Validate facebook share
        const facebook_post_id = getPostIdFromFacebookShareLink(message)
        if (!facebook_post_id) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_facebook_share_link(data[`${userId}`].facebook_id),
                {
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_share_link
                })
            return;
        }
        const facebook_user_id = getUserIdFromFacebookShareLink(message)
        if (facebook_user_id !== data[`${userId}`].facebook_id) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_facebook_share_link(data[`${userId}`].facebook_id),
                {
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_share_link
                })
            return;
        }
        const userData = await airdropData.findOne({ facebook_post_id })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_use_facebook_share_link,
                {
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_share_link
                })
            return;
        }

        data[`${userId}`].facebook_post_id = facebook_post_id
        console.log({ userId: data[`${userId}`] })
        await setTeleUserStep(userId, Steps.enter_telegram_username)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.enter_telegram_username(userFirstName),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_join_telegram
            })

    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_facebook_share_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_facebook_share_link
            })
    }
}