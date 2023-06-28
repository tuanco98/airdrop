
import { getTotalAmountActive, setTeleUserStep } from "../cache"
import { consoleLogDev } from "../color-log"
import { ErrorNotification } from "../error_handler"
import { airdropData, mongo } from "../mongo"
import { bot, bot_script, Steps } from "../social/telegram"

export const airdropDataCheckAcceptable = async () => {
    // console.log(`$cron check acceptable - running`)
    const session = mongo.startSession()
    let telegramUserId: string = ""
    try {
        session.startTransaction()
        const totalAmountActive = Number(await getTotalAmountActive())
        // consoleLogDev({ totalAmountActive })

        // consoleLogDev(`${airdropDataCheckAcceptable.name} - find and update airdropData from db`)
        let data = await airdropData.findOneAndUpdate({ is_retweet_link_correct: true, reject_run_out_of_energy: true, acceptedAt: { $exists: false }, is_join_telegram_group: true, is_follow_twitter_page: true, is_join_telegram_channel: true, is_like_tweet: true, is_join_discord_server: true, is_subscribe_youtube: true, isSendFailMessageReason: { $exists: false } }, { $set: { acceptedAt: new Date() } }, { session, returnDocument: "after" })
        if (!data.value) {
            data = await airdropData.findOneAndUpdate({ is_retweet_link_correct: true, reject_run_out_of_energy: false, acceptedAt: { $exists: false }, is_join_telegram_group: true, is_follow_twitter_page: true, is_join_telegram_channel: true, is_like_tweet: true, is_join_discord_server: true, is_subscribe_youtube: true, isSendFailMessageReason: { $exists: false } }, { $set: { acceptedAt: new Date() } }, { session, returnDocument: "after" })
            if (!data.value) return
        }
        // consoleLogDev(`${airdropDataCheckAcceptable.name} - found and update 1 data`)

        // consoleLogDev(`${airdropDataCheckAcceptable.name} - update status of user ${data.value.telegram_id} to ${Steps.active_status}`)
        await setTeleUserStep(data.value.telegram_id, Steps.active_status)
        // consoleLogDev(`${airdropDataCheckAcceptable.name} - send telegram message to user ${data.value.telegram_id}`)
        telegramUserId = data.value.telegram_id
        await bot.telegram.sendMessage(
            data.value.telegram_id,
            bot_script.message.ending(data.value.telegram_first_name, data.value),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                // reply_markup: bot_script.reply_markup.active
            })

        await session.commitTransaction()
        return
    } catch (e: any) {
        ErrorNotification(e, {}, airdropDataCheckAcceptable.name)
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
        // console.log(`$cron check acceptable - end`)
        setTimeout(airdropDataCheckAcceptable, 2000)
    }
}

