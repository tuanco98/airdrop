import { successConsoleLog } from "./color-log"
import { MONGO_URI, NODE_ENV } from "./config"
import { tickets, questions, connectMongo, user_datas } from "./mongodb"
import { ClearRedis, connectRedis } from "./redis"

export const reset = async () => {
    try {
        if (NODE_ENV !== "prod") {
            await connectRedis()
            ClearRedis()
            await connectMongo(MONGO_URI)
            await tickets.deleteMany({})
            await tickets.dropIndexes({})
            await user_datas.deleteMany({})
            await user_datas.dropIndexes({})
            successConsoleLog(`__DONE__`)
        } else {
            successConsoleLog(`YOU CAN NOT DO THAT`)
        }
        return
    } catch (e) {
        throw e
    }
}
reset()