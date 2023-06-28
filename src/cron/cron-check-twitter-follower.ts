import { BulkWriteOperation } from "mongodb"
import { ErrorNotification } from "../error_handler"
import { airdropData, mongo } from "../mongo"
import { twitter_dev } from "../social/twitter"
import { AirdropData } from "../types/AirdropData"


export const airdropDataCheckFollower = async () => {
    // console.log(`$cron check follower - running`)
    const session = mongo.startSession()
    try {
        await session.startTransaction()
        const data = await airdropData.find({ is_follow_twitter_page: false, acceptedAt: { $exists: false }, follow_twitter_fail_reason: { $exists: false } }, { session }).limit(100).toArray()
        if (!data.length) return
        const createUpdateBulkWrite: (username: string, message: string, isPass: boolean) => BulkWriteOperation<AirdropData> = (username: string, message: string, isPass: boolean) => {
            return {
                updateOne: {
                    filter: {
                        twitter_username: username
                    },
                    update: {
                        $set: {
                            follow_twitter_fail_reason: message,
                            is_follow_twitter_page: isPass
                        }
                    }
                }
            }
        }
        const allUserName = data.map(el => el.twitter_username)
        const checkFriendship = await twitter_dev.checkFollow(allUserName)
        const bulkWriteOperation: BulkWriteOperation<AirdropData>[] = checkFriendship.map((el, index) => createUpdateBulkWrite(allUserName[index], el ? "OK" : "not follow twitter page", el))
        await airdropData.bulkWrite(bulkWriteOperation, { session })
        await session.commitTransaction()
    } catch (e) {
        ErrorNotification(e, {}, airdropDataCheckFollower.name)
        if (session.inTransaction()) await session.abortTransaction();
        throw e
    } finally {
        // console.log(`$cron check follower - end`)
        await session.endSession();
        setTimeout(airdropDataCheckFollower, (60000 / twitter_dev.checkFollowRateLimit)*2)
    }
}

