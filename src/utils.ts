import CryptoJS from "crypto-js"
import { TweetV2, TweetV2SingleResult } from "twitter-api-v2"
import axios from "axios"

import BigNumber from "bignumber.js"
import { randomBytes, randomInt } from "crypto"
import { TIMESTAMP_END_EVENT, TIMESTAMP_START_EVENT } from "./config"
import { ErrMsg, ERROR_CODE } from "./error_handle"
import { web3 } from "./web3"
import { ClientSession } from "mongodb"
import { tickets } from "./mongodb"

export const httpRequest = async (http_url: string, query: string, params: any): Promise<any> => {
    try {
        return new Promise((resolve, reject) => {
            axios
                .post(http_url, { query, variables: params }, { timeout: 60000 })
                .then((response) => resolve(response))
                .catch(async (err) => {
                    reject(new Error(err.message)) 
                })
        })
    } catch (e: any) {
        throw e
    }
}

export const create_ref_code = (address: string) => {
    const value = address + new Date().getTime().toString()
    let md5_hash = CryptoJS.MD5(value).toString()
    const result = new BigNumber("0x" + md5_hash).mod("1000000000").toString()
    return result
}
export const isEventReady = (timestamp: number) => {
    try {
        const [start_event, end_event] = [Number(TIMESTAMP_START_EVENT), Number(TIMESTAMP_END_EVENT)]
        if (timestamp < start_event) throw ErrMsg(ERROR_CODE.EVENT_IS_NOT_READY)
        if (timestamp > end_event) throw ErrMsg(ERROR_CODE.EVENT_HAS_ENDED)
    } catch (e) {
        throw e
    }
}
export const random_byte = (value: number) => {
    const x = randomBytes(4).toString("hex")
    const x_bn = new BigNumber(`0x${x}`).mod(value).toNumber()
    return x_bn
}
export const create_ticket = async (session?: ClientSession) => {
    try {
        let result: string = ""
        while (result === "") {
            const ticket = randomInt(99999999).toString()
            if (ticket.length < 7) continue
            const is_exist = await tickets.findOne({ code: ticket })
            if (is_exist) continue
            result = ticket
        }
        return result
    } catch (e) {
        throw e
    }
}

export const getTweetIdFromLink = (message: string) => {
    let _message = message || ""
    if (_message.split("/")[5]) {
        let result = _message.split("/")[5].split("?")[0].split("=")[0].substring(0, 19)
        return result
    }
    return ""
}
export const getUsernameFromLink = (message: string) => {
    let _message = message || ""
    return _message.split("/")[3].toLowerCase() || ""
}
export const isValidRetweetLink = (message: string, post_url?: string, notFrom?: string) => {
    if (post_url && post_url === message) return false
    const splitMessages = message.split("/")
    if (notFrom && splitMessages[3] === notFrom) return false
    if (
        splitMessages.length === 6 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["twitter.com", "mobile.twitter.com", "www.twitter.com"].includes(splitMessages[2]) &&
        splitMessages[4] === "status" &&
        !Number.isNaN(Number(getTweetIdFromLink(message))) &&
        Number(getTweetIdFromLink(message))
    )
        return true
    return false
}
const RetweetFailReason = {
    notPassTweet: `You have not retweeted our required post.`,
    notPassMissHashtag: `No hashtag.`,
    notPassHashtag: `Incorrect hashtag.`,
}
type RetweetRequired = {
    hashtag_require: string[]
    tweet_url: string
}
export const checkSingleRetweetData = (retweetData: TweetV2SingleResult, required: RetweetRequired) => {
    const { hashtag_require, tweet_url } = required
    if (retweetData.errors) {
        return retweetData.errors[0].detail
    }
    const retweet = retweetData.data
    const isPassTweet =
        retweet.entities?.urls &&
        retweet.entities.urls.some((el) => getTweetIdFromLink(el.expanded_url) === getTweetIdFromLink(tweet_url))
    const isPassMissHashtag = retweet.entities?.hashtags && retweet.entities.hashtags.length > 0
    let isPassHashtag: boolean = true
    for (let tag of hashtag_require) {
        const _hashtags = retweet.entities?.hashtags.map(el => el.tag.trim().toLowerCase()) || []
        const is_correct = _hashtags.includes(tag.trim().toLowerCase())
        if (!is_correct) {
            isPassHashtag = is_correct
            break;
        }
    }
    const retweet_fail_reason = `${isPassTweet ? "" : RetweetFailReason.notPassTweet}${
        isPassMissHashtag
            ? isPassHashtag
                ? ""
                : RetweetFailReason.notPassHashtag
            : RetweetFailReason.notPassMissHashtag
    }`
    if (!retweet_fail_reason.trim()) return "OK"
    return retweet_fail_reason
}
export const checkRetweetData = (retweetData: TweetV2, required: RetweetRequired) => {
    const { hashtag_require, tweet_url } = required

    //Check urls
    const allUrl = retweetData.entities?.urls || []
    const isPassTweet = allUrl.some((el) => getTweetIdFromLink(el.expanded_url) === getTweetIdFromLink(tweet_url))

    //Check hashtag
    const allHashtag = retweetData.entities?.hashtags || []
    const isPassMissHashtag = allHashtag.length > 0
    const isPassHashtag = allHashtag.some((el) => hashtag_require.includes(el.tag.toLowerCase()))
    //Return reason
    const retweet_fail_reason = `${isPassTweet ? "" : RetweetFailReason.notPassTweet}${
        isPassMissHashtag ? "" : RetweetFailReason.notPassMissHashtag
    } ${isPassHashtag ? "" : RetweetFailReason.notPassHashtag}`

    if (!retweet_fail_reason.trim()) return "OK"
    return retweet_fail_reason
}
export const mili_timestamp = (seconds: string | number) => {
    if (seconds.toString().length >= 13) return Number(seconds)
    return Number(seconds) * 1000
}
export const getTimestampFromBlock = async (blockNumber: number) => {
    const timestamp = (await web3.eth.getBlock(blockNumber)).timestamp
    return mili_timestamp(timestamp)
}
