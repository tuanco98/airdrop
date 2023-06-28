
import { config_TELEGRAM_ADMIN_WHITELIST } from "../../config"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script, data } from "../telegram"

export const airdrop_command_admin_check_event_status = async (username: string, chatId: string | number) => {
    try {
        if (config_TELEGRAM_ADMIN_WHITELIST.includes(username)) {
            // bot.telegram.sendDocument(chatId, { source: data, filename: 'test.txt' })
        //     const totalRequest = await airdropData.countDocuments({})
        //     const totalFail = await airdropData.countDocuments({
        //         acceptedAt: { $exists: false },
        //         $or: [
        //             { follow_twitter_fail_reason: { $exists: true } },
        //             { retweet_fail_reason: { $exists: true } },
        //             { result_check_like_tweet: { $exists: true } },
        //         ]
        //     })
        //     const totalPass = await airdropData.countDocuments({ acceptedAt: { $exists: true } })
        //     const totalPending = await airdropData.countDocuments(
        //         {
        //             acceptedAt: { $exists: false },
        //             $or: [
        //                 { follow_twitter_fail_reason: { $exists: false } },
        //                 { retweet_fail_reason: { $exists: false } },
        //                 { result_check_like_tweet: { $exists: false } },
        //             ]
        //         })
        //     const totalReceived = await airdropData.countDocuments(
        //         {
        //             txid: { $exists: true },
        //         })
        //     await bot.telegram.sendMessage(
        //         chatId,
        //         bot_script.message.admin_check(totalRequest, totalFail, totalPass, totalPending, totalReceived),
        //         {
        //             parse_mode: "Markdown",
        //             disable_web_page_preview: true,
        //         })
        // } else {
        //     await bot.telegram.sendMessage(
        //         chatId,
        //         bot_script.message.unknown_command,
        //         {
        //             parse_mode: "Markdown",
        //             disable_web_page_preview: true,
        //             reply_markup: bot_script.reply_markup.unknown_command
        //         })
        //     return
        }
    } catch (e) {
        ErrorNotification(e, { username, chatId }, airdrop_command_admin_check_event_status.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
    }
}