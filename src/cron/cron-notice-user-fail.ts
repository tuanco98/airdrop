import { ErrorNotification } from "../error_handler"
import { airdropData, mongo } from "../mongo"
import { bot, bot_script } from "../social/telegram"


export const airdropRemindUser = async () => {
    const session = mongo.startSession()
    let telegramUserId: string = ""
    try {
        await session.startTransaction()
        const data = await airdropData.findOneAndUpdate({
            $or: [
                { is_join_telegram_channel: false },
                { is_join_telegram_group: false },
                { $and: [{ is_like_tweet: false }, { result_check_like_tweet: { $exists: true } }] },
                { $and: [{ is_follow_twitter_page: false }, { follow_twitter_fail_reason: { $exists: true } }] },
                { $and: [{ is_retweet_link_correct: false }, { retweet_fail_reason: { $exists: true } }] },
            ],
            isChecked: { $exists: false },
            isSendFailMessageReason: { $exists: false }
        }, { $set: { isChecked: true } }, { session, returnDocument: "after" })
        const userData = data.value
        console.log(userData)
        if (userData) {
            telegramUserId = userData.telegram_id
            await bot.telegram.sendMessage(
                userData.telegram_id,
                bot_script.message.check(userData),
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.pending
                })
        }
        await session.commitTransaction()
    } catch (e: any) {
        ErrorNotification(e, {}, airdropRemindUser.name)
        if (e.response?.error_code === 403) {
            console.log(`catch error_code = 403`)
            await airdropData.findOneAndUpdate({ telegram_id: telegramUserId }, {
                $set: {
                    isSendFailMessageReason: e.response?.description
                }
            })
        }

        if (session.inTransaction()) await session.abortTransaction();
        throw e
    } finally {
        await session.endSession();
        setTimeout(airdropRemindUser, 5 * 60 * 1000)
    }
}

