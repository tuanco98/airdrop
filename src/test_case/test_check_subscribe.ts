import { config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK } from "../config"
import { checkSubscribeYoutubeChannel } from "../social/google"
import { twitter_dev_2 } from "../social/twitter"
import { getTweetIdFromLink } from "../utils"

export const test_check_subscribe = async () => {
    try {
        // const channelId = "UCxbcur1qOOQ4sylbnBgu6YQ"
        const channelId = "UC0ZjqfeMqfVBa8C7fQVCk2A"
        await checkSubscribeYoutubeChannel(channelId)
    } catch (e) {
        throw e
    }
}