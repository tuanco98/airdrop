import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { checkSubscribeYoutubeChannel } from "../google";
import { bot, bot_script, data, Steps } from "../telegram"
import { checkYoutubeChannel } from "../youtube";

export const air_drop_enter_youtube_email = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
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
        //Validate discord id
        if (!bot_script.validate.email(message)) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_youtube_email,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_youtube_email
                })
            return;
        }
        const userData = await airdropData.findOne({ youtube_email: message })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_use_youtube_email,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_youtube_email
                })
            return;
        }
        const isSubscribed = await checkSubscribeYoutubeChannel(message)
        if (!isSubscribed) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.must_subscribe_warning(),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_youtube_email
                })
            return;
        }
        data[`${userId}`].youtube_email = message
        console.log({ userId: data[`${userId}`] })
        await setTeleUserStep(userId, Steps.enter_address)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.enter_address(userFirstName),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_address
            })
     
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_enter_youtube_email.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_youtube_email
            })
    }
}