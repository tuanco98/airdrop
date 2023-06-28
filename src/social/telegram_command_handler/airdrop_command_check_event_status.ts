
import { getLikedPostUsers, getTotalAmountActive, getTotalAmountFreeze } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script } from "../telegram"

export const airdrop_command_check_event_status = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        const activeUser = await airdropData.countDocuments({ acceptedAt: { $exists: true } })
        const totalUser = await airdropData.countDocuments({})
        const totalFailFollowTwitter = await airdropData.countDocuments({ is_follow_twitter_page: false, follow_twitter_fail_reason: { $exists: true } })
        const totalFailQuoteTweet = await airdropData.countDocuments({ is_retweet_link_correct: false, retweet_fail_reason: { $exists: true } })
        const totalFailLikeTweet = await airdropData.countDocuments({ is_like_tweet: false})
        const totalLikeTweet=(await getLikedPostUsers()).length
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.checkEventStatus(activeUser, totalUser,totalFailFollowTwitter,totalFailQuoteTweet,totalFailLikeTweet,totalLikeTweet),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.check_event_status
            })
    } catch (e) {
        ErrorNotification(e, { userId, userFirstName, chatId }, airdrop_command_check_event_status.name)
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