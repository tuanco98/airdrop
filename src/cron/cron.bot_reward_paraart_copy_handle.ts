import { ClientSession } from "mongodb"
import { Contract } from "web3-eth-contract"
import { enable_bot_reward_paraart_copy } from ".."
import { getAirdropReward, setAirdropReward } from "../cache"
import { UserData } from "../models/UserData"
import { mongo, user_datas } from "../mongodb"
import { getTimestampFromBlock } from "../utils"
import { reward_para_art_copy_bot_address, paraartContract } from "../web3"

let timeout = 3000
export const bot_reward_paraart_copy_handle = async () => {
    const session = mongo.startSession()
    try {
        if (!enable_bot_reward_paraart_copy) return
        await session.withTransaction(async () => {
            const get_user_waiting_reward = await user_datas.findOne(
                {
                    is_unbox: true,
                    para_art_copy: { $gt: 0 },
                    error: { $exists: false },
                    reward_info: { $exists: false },
                },
                { session }
            )
            if (!get_user_waiting_reward) return
            const get_cache = await getAirdropReward(get_user_waiting_reward.address)
            if (get_cache) {
                await user_datas.updateOne(
                    { _id: get_user_waiting_reward._id },
                    { $set: { reward_info: get_cache } },
                    { session }
                )
                return
            }
            const hashed = get_user_waiting_reward.hashed_prize
            if (!hashed) {
                await handleErrorSendReward("hashed prize null", get_user_waiting_reward, session)
                return
            }
            await signTransaction(
                paraartContract,
                reward_para_art_copy_bot_address,
                get_user_waiting_reward,
                hashed,
                session
            )
        })
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
        setTimeout(bot_reward_paraart_copy_handle, timeout)
    }
}
const signTransaction = async (
    contract: Contract,
    bot_address: string,
    user_data: UserData,
    hashed: string,
    session: ClientSession
) => {
    try {
        const receipt = await contract.methods
            .copyrightRental(user_data.address, hashed)
            .send({ from: bot_address, gas: 1000000 })

        const { blockNumber, transactionHash, returnValues } = receipt?.events?.CopyrightRental
        const timestamp = await getTimestampFromBlock(blockNumber)
        const reward_info = {
            txid: transactionHash,
            blockNumber: blockNumber,
            timestamp: timestamp,
            result: returnValues,
        }
        // set cache
        await setAirdropReward(user_data.address, reward_info)
        await user_datas.updateOne(
            { _id: user_data._id },
            {
                $set: { reward_info },
            },
            { session }
        )
    } catch (e: any) {
        await handleErrorSendReward(e, user_data, session)
    }
}
const handleErrorSendReward = async (err: any, user_data: UserData, session: ClientSession) => {
    try {
        console.log(err)
        const { message = "" } = err
        let [transactionHash, blockNumber, status] = ["", 0, false]
        if (err.receipt) {
            transactionHash = err.receipt.transactionHash
            blockNumber = err.receipt.blockNumber
            status = err.receipt.status
        }
        const timestamp = await getTimestampFromBlock(blockNumber)
        await user_datas.updateOne(
            { _id: user_data._id },
            {
                $set: {
                    error: {
                        txid: transactionHash,
                        blockNumber,
                        status,
                        message,
                        timestamp,
                    },
                },
            },
            { session }
        )
    } catch (e) {
        throw e
    }
}
