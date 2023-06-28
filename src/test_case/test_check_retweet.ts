import { config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK } from "../config"
import { twitter_dev_2 } from "../social/twitter"
import { getTweetIdFromLink } from "../utils"

export const test_check_retweet_hashtag = async (tweetId: string) => {
    try {
        const retweet = await twitter_dev_2.getTweet(tweetId)
      
        const hashtag = retweet.data.entities?.hashtags
        console.table(retweet.data.entities?.hashtags)
        if (hashtag) {
            console.table({
                passHashtag: ["theparallel"].includes(hashtag[0].tag)
            })
        }
    } catch (e) {
        throw e
    }
}
