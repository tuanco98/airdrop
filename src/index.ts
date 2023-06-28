import { initSentry, Sentry } from "./sentry"
import { airdropDataCheckFollower } from "./cron/cron-check-twitter-follower"
import { airdropDataCheckRetweetLink } from "./cron/cron-check-retweet-link"
import { airdropDataCheckLikeTweet } from "./cron/cron-check-like-tweet"
import { airdropDataCheckAcceptable } from "./cron/cron-check-acceptabe"
import { check_status } from "./check_status"


const start = async () => {
    try {
        await initSentry()
        await check_status()
        await airdropDataCheckFollower()
        await airdropDataCheckRetweetLink()
        await airdropDataCheckLikeTweet()
        await airdropDataCheckAcceptable()
    } catch (e) {
        Sentry.captureException(e)
        console.log(e)
    }
}


start()


