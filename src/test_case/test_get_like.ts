import { config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK } from "../config"
import { twitter_dev_2 } from "../social/twitter"
import { getTweetIdFromLink } from "../utils"

export const test_get_like = async () => {
    try {
        const tweetId = getTweetIdFromLink(config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK)
        console.log({tweetId})
        let allNewLike = await twitter_dev_2.getLikes(tweetId)
        console.log(allNewLike)
    } catch (e) {
        throw e
    }
}