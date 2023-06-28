import { BulkWriteOperation } from "mongodb"
import { RetweetRequired } from "../airdrop/retweetRequired"
import { ErrorNotification } from "../error_handler"
import { airdropData, mongo } from "../mongo"
import { bot_script } from "../social/telegram"
import { twitter_dev_2 } from "../social/twitter"
import { AirdropData } from "../types/AirdropData"
import { checkRetweetData, getTweetIdFromLink, isValidRetweetLink } from "../utils"



const TronPowerRetweetRequired: RetweetRequired = {
    hashtag_require: bot_script._hashtag,
    tweet_url: bot_script._airdrop_tweet_url,
    number_user_mention_require: bot_script._number_friend_tag_require,
    not_mention_users: [bot_script._twitter_page_username]
}


export const airdropDataCheckRetweetLink = async () => {
    // console.log(`$cron check retweet - running`)
    const session = mongo.startSession()
    try {
        await session.startTransaction()
        const data = await airdropData.find({ is_retweet_link_correct: false, acceptedAt: { $exists: false }, retweet_fail_reason: { $exists: false } }, { session }).limit(100).toArray()
        if (!data.length) return
        const createUpdateBulkWrite: (id: string, message: string, isPass: boolean) => BulkWriteOperation<AirdropData> = (id: string, message: string, isPass: boolean) => {
            // console.log(`${id}:${newData[id]}`)
            return {
                updateOne: {
                    filter: {
                        telegram_id: newData[id] ? newData[id].telegram_id : newData["0" + id].telegram_id
                    },
                    update: {
                        $set: {
                            retweet_fail_reason: message,
                            is_retweet_link_correct: isPass
                        }
                    }
                }
            }
        }
        const newData: AirdropData[] = []
        let failBulkWriteOperation: BulkWriteOperation<AirdropData>[] = []
        for (let i = 0; i < data.length; i++) {
            if (isValidRetweetLink(data[i].retweet_link)) {
                newData[`${getTweetIdFromLink(data[i].retweet_link)}`] = data[i]
            }
            else {
                failBulkWriteOperation.push(
                    {
                        updateOne: {
                            filter: {
                                telegram_id: data[i].telegram_id
                            },
                            update: {
                                $set: {
                                    retweet_fail_reason: "invalid retweet link",
                                    is_retweet_link_correct: false
                                }
                            }
                        }
                    }
                )
            }
        }
        // console.log("New Data length", newData.length)
        const allDataRetweetId = Object.keys(newData)
        // console.log('allDataRetweetId', allDataRetweetId.length)
        const tweetData = await twitter_dev_2.getTweets(allDataRetweetId)
        // console.log('tweetData', tweetData)
        let errorBulkWriteOperation: BulkWriteOperation<AirdropData>[] = []
        let bulkWriteOperation: BulkWriteOperation<AirdropData>[] = []
        if (tweetData.errors) {
            errorBulkWriteOperation = tweetData.errors.map(el => createUpdateBulkWrite(el.value || "", el.detail, false))
        }
        if (tweetData.data) {
            bulkWriteOperation = tweetData.data.map((el) => createUpdateBulkWrite(el.id, checkRetweetData(el, TronPowerRetweetRequired), checkRetweetData(el, TronPowerRetweetRequired) === "OK"))
        }
        await airdropData.bulkWrite([...bulkWriteOperation, ...failBulkWriteOperation, ...errorBulkWriteOperation], { session })
        await session.commitTransaction()
    } catch (e) {
        ErrorNotification(e, {}, airdropDataCheckRetweetLink.name)
        if (session.inTransaction()) await session.abortTransaction();
        throw e
    } finally {
        // consoleLogDev(`${airdropDataCheckRetweetLink.name} - end`)
        await session.endSession();
        setTimeout(airdropDataCheckRetweetLink, (60000 / twitter_dev_2.getTweetRateLimit) * 2)
    }
}

