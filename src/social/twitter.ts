import Twit from "twit"
import TwitterApi from "twitter-api-v2"

import { config_TWITTER_ACCESS_TOKEN, config_TWITTER_ACCESS_TOKEN_SECRET, config_TWITTER_APPLICATION_CONSUMER_KEY, config_TWITTER_APPLICATION_CONSUMER_SECRET, config_TWITTER_BEARER_TOKEN } from "../config";
const twit = new Twit({
    consumer_key: config_TWITTER_APPLICATION_CONSUMER_KEY,
    consumer_secret: config_TWITTER_APPLICATION_CONSUMER_SECRET,
    access_token: config_TWITTER_ACCESS_TOKEN,
    access_token_secret: config_TWITTER_ACCESS_TOKEN_SECRET
});

export const checkRetweet = async () => {
    try {

        const data = await new Promise((res, rej) => {
            twit.get("statuses/show/:id", { id: '1412598620159823874' }, (err, data: any) => {
                if (err) { rej(err) }
                res(data)
            })
        }) as { created_at: string, text: string, entities: { hashtags: any[], user_mentions: any[] }, user: { screen_name: string } }
        console.log(data)
        console.log(data.entities)
    } catch (e) {
        throw e
    }
}

export enum TwitterConnection {
    none = "none",
    following = "following",
    followed_by = "followed_by",
    following_requested = "following_requested"
}
export type FriendShip = {
    name: string,
    screen_name: string,
    id: number,
    id_str: string,
    connections: TwitterConnection[]
}

/**
 * Connect to twitter developer API v2
 * @param bearerToken
 * @link https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api
 */
class TwitterDev2 {
    private _twit: TwitterApi

    constructor(bearerToken: string) {
        this._twit = new TwitterApi(bearerToken)
    }

    /**
     * Returns a single Tweet, specified by the id parameter. The Tweet's author will also be embedded within the Tweet.
     * 900 requests per 15-minute window (user auth)
     * @param id The numerical ID of the desired Tweet.
     * @link https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id
     */
    public getTweet = async (id: string) => {
        try {
            const tweetResponse = await this._twit.readOnly.v2.singleTweet(id, { "tweet.fields": ["entities"] })
            return tweetResponse
        } catch (e) {
            throw e
        }
    }
    /**60 rate limit per minute */
    public getTweetRateLimit = 60
    /**
     * Returns a variety of information about the Tweet specified by the requested ID or list of IDs.
     * 300 requests per 15-minute window (app auth)
     * 900 requests per 15-minute window (user auth)
     * @param ids The array of numerical ID of the desired Tweet
     * @link https://developer.twitter.com/en/docs/twitter-api/twevets/lookup/api-reference/get-tweets
     */
    public getTweets = async (ids: string[]) => {
        try {
            const tweetResponse = await this._twit.readOnly.v2.tweets(ids, { "tweet.fields": ["entities", "author_id"] })
            return tweetResponse
        } catch (e) {
            throw e
        }
    }
    /**60 rate limit per minute */
    public getTweetsRateLimit = 60
    /**
       * App rate limit: 75 requests per 15-minute window
       * User rate limit: 75 requests per 15-minute window
       * @param ids Tweet ID of the Tweet to request liking users of.
       * @returns 
       * @link https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/get-tweets-id-liking_users
       */
    public getLikes = async (id: string) => {
        try {
            const tweetResponse = await this._twit.v2.get(`tweets/${id}/liking_users`)
            return tweetResponse as { data: { id: string, name: string, username: string }[], meta: { result_count: number } }
        } catch (e) {
            throw e
        }
    }

    /**5 rate limit per minute */
    public getLikesRateLimit = 5

}

/**
 * Connect to twitter developer API v1.1
 * @param consumer_key
 * @param consumer_secret
 * @param access_token
 * @param access_token_secret 
 * @link https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api
 */
class TwitterDev {
    private _twit: Twit

    constructor({ consumer_key, consumer_secret, access_token, access_token_secret }) {
        this._twit = new Twit({ consumer_key, consumer_secret, access_token, access_token_secret })
    }

    /**
     * Returns the relationships of the authenticating user to the comma-separated list of up to 100 screen_names or user_ids provided
     * Requests / 15-min window (app auth) = 15
     * @param usernames A comma separated list of screen names, up to 100 are allowed in a single request.
     * @returns array of follower
     * @ https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-lookup
     */

    public checkFollow = async (usernames: string[]) => {
        const data = await new Promise((res, rej) => {
            this._twit.get("friendships/lookup", { screen_name: usernames.join(",") }, (err, data: any) => {
                console.log({ err, data })
                if (err) { rej(err) }
                res(data)
            })
        }) as FriendShip[]

        const result = usernames.map(el => {
            const index = data.findIndex(el2 => el2.screen_name.toLowerCase() === el.toLowerCase())
            if (index < 0) return false
            return data[index].connections.includes(TwitterConnection.followed_by)
        }
        )
        return result
    }

    /**
  * App rate limit: 300 requests per 15-minute window shared among all users of your app
  * App rate limit: 1 request per second shared among all users of your app
  * @param hashtag 
  * @returns 
  * @link https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/overview
  */
    public getTweetsHasHashtag = async (hashtag: string) => {
        try {
            const tweetResponse = await this._twit.get(`search/tweets.json?q=${hashtag}&include_entities=true&count=100`)
            return tweetResponse.data
        } catch (e) {
            throw e
        }
    }

    public getTweetsByQuery = async (query: string) => {
        try {
            const tweetResponse = await this._twit.get(`search/tweets.json${query}`)
            return tweetResponse.data
        } catch (e) {
            throw e
        }
    }
    /**rate limit per minute */
    public checkFollowRateLimit = 1
}

export const twitter_dev = new TwitterDev({
    consumer_key: config_TWITTER_APPLICATION_CONSUMER_KEY,
    consumer_secret: config_TWITTER_APPLICATION_CONSUMER_SECRET,
    access_token: config_TWITTER_ACCESS_TOKEN,
    access_token_secret: config_TWITTER_ACCESS_TOKEN_SECRET
})

export const twitter_dev_2 = new TwitterDev2(config_TWITTER_BEARER_TOKEN)


