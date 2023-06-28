import { BulkWriteOperation } from "mongodb"
import {  getLikedPostUsers, setLikedPostUsers } from "../cache"
import { config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK } from "../config"
import { ErrorNotification } from "../error_handler"
import { airdropData, mongo } from "../mongo"
import {  twitter_dev_2 } from "../social/twitter"
import { AirdropData } from "../types/AirdropData"
import { addToSet, getTweetIdFromLink } from "../utils"


export const airdropDataCheckLikeTweet = async () => {
    console.log(`$cron check like - running`)
    const session = mongo.startSession()
    try {
        await session.startTransaction()
        const tweetId = getTweetIdFromLink(config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK)
        let likedTweetUsers=await getLikedPostUsers()
        const data = await airdropData.find({ is_like_tweet: false, acceptedAt: { $exists: false }, result_check_like_tweet: { $exists: false } }, { session }).limit(20).toArray()
        let allNewLike = await twitter_dev_2.getLikes(tweetId)
       
        if (allNewLike.data) {
            const newLikedUser=allNewLike.data.map(el=>el.username.toLowerCase()) 
            if(allNewLike.data.length){ 
                likedTweetUsers=addToSet(likedTweetUsers,newLikedUser)
                await setLikedPostUsers(likedTweetUsers) 
            }
        }
        if (!data.length) {
            await session.abortTransaction()
            return
        }
        const createUpdateBulkWrite: (username: string, message: string, isPass: boolean) => BulkWriteOperation<AirdropData> = (username: string, message: string, isPass: boolean) => {
            return {
                updateOne: {
                    filter: {
                        twitter_username: username
                    },
                    update: {
                        $set: {
                            result_check_like_tweet: message,
                            is_like_tweet: isPass
                        }
                    }
                }
            }
        }
        const allUserName = data.map(el => el.twitter_username.toLowerCase())
        const airdropBulkWriteOperation: BulkWriteOperation<AirdropData>[]=allUserName.map(el=>{
            const isLike=likedTweetUsers.includes(el)
            return createUpdateBulkWrite(el,isLike?"OK":"you have not liked our tweet",isLike)
        })
        if(airdropBulkWriteOperation.length){
            await airdropData.bulkWrite(airdropBulkWriteOperation, { session })
        }
        await session.commitTransaction()
    } catch (e) {
        ErrorNotification(e, {}, airdropDataCheckLikeTweet.name)
        if (session.inTransaction()) await session.abortTransaction();
        throw e
    } finally {
        // console.log(`$cron check like - end`)
        await session.endSession();
        setTimeout(airdropDataCheckLikeTweet, (60000 / twitter_dev_2.getLikesRateLimit) * 2)
    }
}

