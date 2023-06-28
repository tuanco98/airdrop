import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { getIdFacebookPageLink, getPostIdFromFacebookShareLink } from "../../utils";
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_facebook_link_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
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
        const facebook_id = getIdFacebookPageLink(message)
        if (!facebook_id) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_facebook_link,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_link
                })
            return;
        }
        const userData = await airdropData.findOne({ facebook_id })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_use_facebook_link,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_facebook_link
                })
            return;
        }

        data[`${userId}`].facebook_id = facebook_id
        console.log({ userId: data[`${userId}`] })
        await setTeleUserStep(userId, Steps.enter_facebook_share_link)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.enter_facebook_share_link(facebook_id),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_facebook_share_link
            })


    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_facebook_link_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_facebook_link
            })
    }
}