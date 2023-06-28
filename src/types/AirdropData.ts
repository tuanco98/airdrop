import { IndexSpecification } from "mongodb"

export enum FailStatus {
    NOT_JOIN_TELEGRAM_GROUP = "NOT_JOIN_TELEGRAM_GROUP",
    NOT_JOIN_TELEGRAM_CHANEL = "NOT_JOIN_TELEGRAM_CHANEL",
    NOT_FOLLOW_TWITTER_PAGE = "NOT_FOLLOW_TWITTER_PAGE",
    NOT_RETWEET = "NOT_RETWEET",
    NOT_LIKE_TWEET = "NOT_LIKE_TWEET",
    NOT_TAG_ENOUGH_FRIENDS = "NOT_TAG_ENOUGH_FRIENDS",
}

export type AirdropData = {
    telegram_id: string,
    telegram_first_name: string,
    address: string,
    twitter_username: string,
    retweet_link: string,
    retweet_id: string,
    discord_username: string,
    youtube_email: string,
    facebook_id: string,
    facebook_post_id: string
    is_like_and_comment_facebook: Boolean
    is_share_facebook_post: Boolean
    is_join_telegram_group: Boolean
    is_join_telegram_channel: Boolean
    is_follow_twitter_page: Boolean
    is_retweet_link_correct: Boolean
    is_like_tweet: Boolean
    is_join_discord_server: Boolean
    is_subscribe_youtube: Boolean
    follow_twitter_fail_reason?: string
    retweet_fail_reason?: string
    result_check_like_tweet?: string
    result_check_join_discord?: string
    result_check_subscribe_youtube?: string
    txid?: string,
    requestAt?: Date
    acceptedAt?: Date
    activateAt?: Date
    reject_run_out_of_energy?: Boolean
    isChecked?: Boolean
    isSendFailMessageReason?: String
}


export const AirdropDataIndexes: IndexSpecification[] = [
    { key: { telegram_id: 1 }, background: true },
    { key: { address: 1 }, unique: true, background: true },
    { key: { twitter_username: 1 }, background: true },
    { key: { txid: 1 }, partialFilterExpression: { txid: { $exists: true } }, unique: true, background: true },
    { key: { retweet_id: 1 }, unique: true, background: true },
    { key: { discord_username: 1 }, unique: true, background: true },
    { key: { youtube_email: 1 }, unique: true, background: true },
    { key: { telegram_first_name: 1 }, background: true },
    { key: { is_join_telegram_group: 1 }, background: true },
    { key: { is_join_telegram_channel: 1 }, background: true },
    { key: { is_follow_twitter_page: 1 }, background: true },
    { key: { is_retweet_link_correct: 1 }, background: true },
    { key: { is_like_tweet: 1 }, background: true },
    { key: { follow_twitter_fail_reason: 1 }, background: true },
    { key: { retweet_fail_reason: 1 }, background: true },
    { key: { result_check_like_tweet: 1 }, background: true },
    { key: { acceptedAt: 1 }, background: true },
    { key: { isChecked: 1 }, background: true }
]