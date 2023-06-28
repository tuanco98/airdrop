import { TWEET_HASH_TAG_REQUIRE, TWEET_POST_URL } from "../../../config"
import { ErrMsg, ErrorHandler, ERROR_CODE, validateMissing } from "../../../error_handle"
import { mongo, user_datas } from "../../../mongodb"
import { twitter_dev_2 } from "../../../service/twitter"
import { verifySignature } from "../../../service/verify_signature"
import { checkSingleRetweetData, getTweetIdFromLink, isEventReady, isValidRetweetLink } from "../../../utils"

export const pr_airdrop_submit_quote_tweet_link = async (root: any, args: any) => {
    const session = mongo.startSession()
    try {
        const { signed_message, signature, address, tweet_link } = args as {
            signed_message: string
            signature: string
            address: string
            tweet_link: string
        }
        const timestamp = new Date().getTime()
        isEventReady(timestamp)
        validateMissing({ signed_message, signature, address, tweet_link })
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)

        const post_url = TWEET_POST_URL
        if (!isValidRetweetLink(tweet_link, post_url)) return false
        let result: boolean = false
        await session.withTransaction(async () => {
            // const hashtag = TWEET_HASH_TAG_REQUIRE.toLowerCase().split(",")
            // const tweet_id = getTweetIdFromLink(tweet_link)
            // const retweet = await twitter_dev_2.getTweet(tweet_id)
            // const require = {
            //     hashtag_require: hashtag,
            //     tweet_url: post_url,
            // }
            // const check_correct = checkSingleRetweetData(retweet, require)
            // if (check_correct !== "OK") {
            //     return
            // }
            const is_exist = await user_datas.findOne({ quote_tweet_link: tweet_link }, { session })
            if (is_exist) throw ErrMsg(ERROR_CODE.REWEET_LINK_IS_EXIST)
            await user_datas.updateOne(
                { address },
                {
                    $set: {
                        is_reweet_link_correct: true,
                        quote_tweet_link: tweet_link,
                        submit_quote_link_at: new Date().getTime(),
                        last_update_at: new Date().getTime(),
                    },
                },
                { session }
            )
            result = true
        })
        return result
    } catch (e: any) {
        if (session.inTransaction()) await session.abortTransaction()
        if (e.name === "MongoError" || e.code === 112) {
            if (session.inTransaction()) await session.endSession()
            return pr_airdrop_submit_quote_tweet_link(root, args)
        }
        ErrorHandler(e, args, pr_airdrop_submit_quote_tweet_link.name)
        throw e
    } finally {
        if (session.inTransaction()) await session.endSession()
    }
}
