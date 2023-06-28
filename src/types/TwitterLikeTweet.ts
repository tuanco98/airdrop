import { IndexSpecification } from "mongodb"

export type TwitterLikeTweet = {
    twitter_username: string
    tweet_id: string
}

export const TwitterLikeTweetIndexes: IndexSpecification[] = [
    { key: { twitter_username: 1 }, background: true },
    { key: { tweet_id: 1 }, background: true },
    { key: { tweet_id: 1, twitter_username: 1 }, unique: true, background: true },
]
