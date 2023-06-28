import { setTeleUserStep } from "../../cache"
import { config_PROJECT_TELEGRAM_GROUP_ID } from "../../config"
import { ErrorNotification } from "../../error_handler"
import { airdropData, mongo } from "../../mongo"
import { bot, bot_script, Steps } from "../telegram"

export const air_drop_pending_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    const session = mongo.startSession()
    try {
        console.log(`${userId}-${userFirstName}: ${message}`)
        session.startTransaction()
        if (message === bot_script.button_message.check) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.waiting_processing,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,

                })

            const roleInGroup = (await bot.telegram.getChatMember(config_PROJECT_TELEGRAM_GROUP_ID, Number(userId))).status
            const roleInChannel = (await bot.telegram.getChatMember(config_PROJECT_TELEGRAM_GROUP_ID, Number(userId))).status
            // const roleInGroup = "member"
            // const roleInChannel = "member"
            const isMemberOfGroup = ["member", "administrator", "creator"].includes(roleInGroup)
            const isMemberOfChannel = ["member", "administrator", "creator"].includes(roleInChannel)
            const userData = await airdropData.findOne({ telegram_id: userId })
            if (!userData) {
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
            const isSubscribed = true
            const isJoinDiscordServer = true
            await airdropData.findOneAndUpdate({ telegram_id: userId }, { $set: { is_join_telegram_channel: isMemberOfChannel, is_join_telegram_group: isMemberOfGroup, is_subscribe_youtube: isSubscribed, isChecked: true, is_join_discord_server: isJoinDiscordServer, result_check_join_discord: "OK", result_check_subscribe_youtube: "OK" } }, { session, returnDocument: "after" })

            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.check(userData),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.pending
                })
        } else {

            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.unknown_command,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.unknown_command
                })
        }
        await session.commitTransaction()
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_pending_handler.name)
        if (session.inTransaction()) {
            await session.abortTransaction()
        }
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.pending
            })
    } finally {
        await session.endSession()
    }
}