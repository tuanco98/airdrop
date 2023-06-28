import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { checkJoinDiscordServer } from "../discord";
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_enter_discord_username = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
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

        if (!bot_script.validate.discord_username(message)) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_discord_username,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_discord_username
                })
            return;
        }
        const userData = await airdropData.findOne({ discord_username: message })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_use_discord_username,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_discord_username
                })
            return;
        }
        // const isJoinDiscordServer = await checkJoinDiscordServer(message)
        // if (!isJoinDiscordServer) {
        //     await bot.telegram.sendMessage(
        //         chatId,
        //         bot_script.message.must_join_discord_server_warning(),
        //         {
        //             parse_mode: "Markdown",
        //             disable_web_page_preview: true,
        //             reply_markup: bot_script.reply_markup.require_youtube_email
        //         })
        //     return;
        // }
        data[`${userId}`].discord_username = message
        console.log({ userId: data[`${userId}`] })
        await setTeleUserStep(userId, Steps.enter_youtube_email)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.enter_youtube_email(),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_youtube_email
            })
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_enter_discord_username.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_discord_username
            })
    }
}