import { TweetEntityMentionV2, TweetV2, TweetV2SingleResult } from "twitter-api-v2";
import { RetweetRequired } from "./airdrop/retweetRequired";
import { config_PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED } from "./config";

export const isValidRetweetLink = (message: string, notFrom?: string) => {
    const splitMessages = message.split("/");
    if (notFrom && splitMessages[3] === notFrom) return false;
    if (
        splitMessages.length === 6 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["twitter.com", "mobile.twitter.com", "www.twitter.com"].includes(splitMessages[2]) &&
        splitMessages[4] === "status" &&
        !Number.isNaN(Number(getTweetIdFromLink(message))) &&

        Number(getTweetIdFromLink(message))
    )
        return true;
    return false;
};
//example facebook link:   https://facebook.com/yourusername or https://facebook.com/profile.php?id=10012345678910)
export const getIdFacebookPageLink = (message: string) => {
    let _message = message || ""
    const splitMessages = _message.split("/");
    if (
        splitMessages.length >= 4 &&
        splitMessages.length <= 5 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["facebook.com", "www.facebook.com"].includes(splitMessages[2]) &&
        !splitMessages[4]
    ) {
        if (splitMessages[3].startsWith("profile")) {
            const id_link = splitMessages[3].split("?")[1]
            if (id_link?.startsWith("id=") && !Number.isNaN(+id_link.substring(3))) {
                return id_link.substring(3)
            } else return null
        }
        return splitMessages[3].split("?")[0];
    }
    return null;
};
//example facebook posts: https://www.facebook.com/parallel/posts/4793957024002468
//example facebook posts: https://m.facebook.com/story.php?story_fbid=598182094768313&id=100037295823275
//example facebook posts: https://m.facebook.com/story.php?story_fbid=598182094768313&id=100037295823275&m_entstream_source=permalink
//example facebook posts: https://www.facebook.com/permalink.php?story_fbid=598182094768313&id=100037295823275
export const getPostIdFromFacebookShareLink = (message: string) => {
    let _message = message || ""
    const splitMessages = _message.split("/");
    if (splitMessages?.length === 4 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["facebook.com", "www.facebook.com", "m.facebook.com"].includes(splitMessages[2]) &&
        splitMessages[3]?.includes("php") &&
        splitMessages[3]?.includes("story_fbid") &&
        splitMessages[3]?.includes("id")) {
        const story_fbid = splitMessages[3]?.split("?")[1].split("&").filter(obj => obj.split("=")[0] === "story_fbid")[0]
        return story_fbid ? story_fbid.split("=")[1] : null
    }
    if (
        splitMessages.length >= 6 &&
        splitMessages.length <= 7 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["facebook.com", "www.facebook.com", "m.facebook.com"].includes(splitMessages[2]) &&
        splitMessages[4] === "posts" &&
        !Number.isNaN(+splitMessages[5]) &&
        (!splitMessages[6] || splitMessages[6] === "?d=n")
    ) {
        return splitMessages[5];
    }
    return null;
};
//example facebook posts:  https://www.facebook.com/parallel/posts/4793957024002468
export const getUserIdFromFacebookShareLink = (message: string) => {
    let _message = message || ""
    const splitMessages = _message.split("/");
    if (splitMessages?.length === 4 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["facebook.com", "www.facebook.com", "m.facebook.com"].includes(splitMessages[2]) &&
        splitMessages[3]?.includes("php") &&
        splitMessages[3]?.includes("story_fbid") &&
        splitMessages[3]?.includes("id")) {
        const id = splitMessages[3]?.split("?")[1].split("&").filter(obj => obj.split("=")[0] === "id")[0]
        return id ? id.split("=")[1] : null
    }
    if (
        splitMessages?.length >= 6 &&
        splitMessages?.length <= 7 &&
        splitMessages[0] === "https:" &&
        splitMessages[1] === "" &&
        ["facebook.com", "www.facebook.com", "m.facebook.com"].includes(splitMessages[2]) &&
        splitMessages[4] === "posts" &&
        !Number.isNaN(+splitMessages[5]) &&
        !splitMessages[6]
    ) {
        return splitMessages[3];
    }
    return null;
};



export const getTweetIdFromLink = (message: string) => {
    let _message = message || ""
    if (_message.split("/")[5]) {
        let result = _message.split("/")[5].split("?")[0].split("=")[0].substring(0, 19);
        return result;
    }
    return "";
};

export const getUsernameFromLink = (message: string) => {
    let _message = message || ""
    return _message.split("/")[3].toLowerCase() || "";
};

const RetweetFailReason = {
    notPassTweet: `You have not retweeted our required post.`,
    notPassMissHashtag: `No hashtag.`,
    notPassHashtag: `Incorrect hashtag.`,
    notPassFriendTag: `Did not tag ${config_PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED} friends.`,
};
export const checkSingleRetweetData = (retweetData: TweetV2SingleResult, required: RetweetRequired) => {
    const { hashtag_require, number_user_mention_require, tweet_url, not_mention_users } = required;
    if (retweetData.errors) {
        return retweetData.errors[0].detail;
    }
    const retweet = retweetData.data;
    const isPassTweet = retweet.entities?.urls && retweet.entities.urls.some((el) => getTweetIdFromLink(el.expanded_url) === getTweetIdFromLink(tweet_url));
    const isPassMissHashtag = retweet.entities?.hashtags && retweet.entities.hashtags.length > 0;
    const isPassHashtag = retweet.entities?.hashtags && retweet.entities.hashtags.some((el) => hashtag_require.includes(el.tag.toLowerCase()));
    const isPassFriendTag = retweet.entities?.mentions && retweet.entities.mentions.filter((el) => !not_mention_users.includes(el.username)).length >= number_user_mention_require;
    const retweet_fail_reason = `${isPassTweet ? "" : RetweetFailReason.notPassTweet}${isPassMissHashtag ? (isPassHashtag ? "" : RetweetFailReason.notPassHashtag) : RetweetFailReason.notPassMissHashtag
        } ${isPassFriendTag ? "" : RetweetFailReason.notPassFriendTag}`;
    if (!retweet_fail_reason.trim()) return "OK";
    return retweet_fail_reason;
};
const uniqueMentions = (array: TweetEntityMentionV2[]) => {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (!obj[array[i].username]) {
            obj[array[i].username] = array[i];
        }
    }
    return Object.values(obj) as TweetEntityMentionV2[];
};
export const checkRetweetData = (retweetData: TweetV2, required: RetweetRequired) => {
    const { hashtag_require, number_user_mention_require, tweet_url, not_mention_users } = required;

    //Check urls
    const allUrl = retweetData.entities?.urls || [];
    const isPassTweet = allUrl.some((el) => getTweetIdFromLink(el.expanded_url) === getTweetIdFromLink(tweet_url));

    //Check hashtag
    const allHashtag = retweetData.entities?.hashtags || [];
    const isPassMissHashtag = allHashtag.length > 0;
    const isPassHashtag = allHashtag.some((el) => hashtag_require.includes((el.tag).toLowerCase()));

    //Check retweet tag friends
    const retweetAuthorId = retweetData.author_id;
    const allMentions = retweetData.entities?.mentions || [];
    const allMentionsWithoutAuthor = allMentions.filter((el) => el["id"] !== retweetAuthorId);
    const uniqueAllMentions = uniqueMentions(allMentionsWithoutAuthor);
    const isPassFriendTag = uniqueAllMentions.filter((el) => !not_mention_users.includes(el.username)).length >= number_user_mention_require;

    //Return reason
    const retweet_fail_reason = `${isPassTweet ? "" : RetweetFailReason.notPassTweet}${isPassMissHashtag ? "" : RetweetFailReason.notPassMissHashtag} ${isPassHashtag ? "" : RetweetFailReason.notPassHashtag
        }${isPassFriendTag ? "" : RetweetFailReason.notPassFriendTag}`;

    if (!retweet_fail_reason.trim()) return "OK";
    return retweet_fail_reason;
};

export const readDate = (time: Date) => {
    const timeToString = (value: number) => `${~~(value / 10) ? value : `0${value}`}`;
    return `$${time.getUTCFullYear()}-${timeToString(time.getUTCMonth() + 1)}-${timeToString(time.getUTCDay() + 1)} ${timeToString(time.getUTCHours())}:${timeToString(
        time.getUTCMinutes()
    )}:${timeToString(time.getUTCSeconds())}`;
};

export const addToSet = (arr: any[], data: any[]) => {
    let temp = [...arr];
    for (let i = 0; i < data.length; i++) {
        if (!arr.includes(data[i])) {
            temp.push(data[i]);
        }
    }
    return temp;
};

export const daysBetween = (fromDate: number, toDate: number): string | boolean => {
    const gapTime = toDate - fromDate;
    if (gapTime < 0) return false;
    const secondPerDay = 86400;
    const secondPerHour = 3600;
    const secondPerMin = 60;
    const Day = ~~(gapTime / secondPerDay);
    const Hour = ~~((gapTime % secondPerDay) / secondPerHour);
    const Minute = ~~((gapTime % secondPerHour) / secondPerMin);
    const Second = ~~(gapTime % secondPerMin);
    const result = `${Day}d, ${Hour}h, ${Minute}m, ${Second}s`;
    return result;
};
