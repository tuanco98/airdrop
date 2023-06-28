import { ClientSession } from "mongodb"
import { Contract } from "web3-eth-contract"
import { enable_bot_reward_paragon } from ".."
import { getCacheParagonReward, setCacheParagonReward } from "../cache"
import { ParagonPrize } from "../models/ParagonPrize"
import { Ticket } from "../models/Ticket"
import { mongo, paragons_prize, tickets } from "../mongodb"
import { getTimestampFromBlock } from "../utils"
import { reward_paragon_bot_address, paragonContract } from "../web3"

let timeout = 3000
export const bot_reward_paragon_handle = async () => {
    const session = mongo.startSession()
    try {
        if (!enable_bot_reward_paragon) return
        await session.withTransaction(async () => {
            const get_queue_reward = await tickets.findOne(
                {
                    is_win_prize: true,
                    is_claimed_prize: true,
                    mint_prize_txid: { $exists: false },
                    error: { $exists: false },
                },
                { session }
            )
            if (!get_queue_reward) return
            const get_cache = await getCacheParagonReward(get_queue_reward.code)
            if (get_cache) {
                await handleErrorSendReward(`rewarded`, get_queue_reward, session, get_cache.toString())
                await paragons_prize.updateOne(
                    { tokenId: get_cache.toString() },
                    { $set: { isReward: true } },
                    { session }
                )
                return
            }
            const get_paragon = await paragons_prize.findOne(
                { rank_prize: get_queue_reward.prize_rank, isReward: false, error: {$exists: false} },
                { session }
            )
            if (!get_paragon) {
                await handleErrorSendReward(
                    `gave all the paragon prize rank: ${get_queue_reward.prize_rank}`,
                    get_queue_reward,
                    session
                )
                return
            }
            console.log('reward prg to user:',get_queue_reward)
            console.log('reward with tokenId:',get_paragon.tokenId)
            await signTransaction(paragonContract, reward_paragon_bot_address, get_queue_reward, get_paragon, session)
        })
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
        setTimeout(bot_reward_paragon_handle, timeout)
    }
}
const signTransaction = async (
    contract: Contract,
    bot_address: string,
    ticket: Ticket,
    paragon_prize: ParagonPrize,
    session: ClientSession
) => {
    try {
        const tokenId = Number(paragon_prize.tokenId)
        await setCacheParagonReward(ticket.code, tokenId)
        const receipt = await contract.methods
            .transferFrom(bot_address, ticket.address, tokenId)
            .send({ from: bot_address, gas: 1000000 })

        const { blockNumber, transactionHash, returnValues } = receipt?.events?.Transfer
        const timestamp = await getTimestampFromBlock(blockNumber)

        await tickets.updateOne(
            { _id: ticket._id },
            {
                $set: { mint_prize_txid: transactionHash, mint_prize_timestamp: timestamp },
            },
            { session }
        )
        await paragons_prize.updateOne(
            { _id: paragon_prize._id },
            {
                $set: {
                    isReward: true,
                    reward_info: {
                        rewardAt: timestamp,
                        reward_to_address: returnValues.to,
                        reward_txid: transactionHash,
                        blockNumber,
                    },
                },
            }
        )
        console.log('reward success -> tx:', transactionHash)
    } catch (e: any) {
        await handleErrorSendReward(e, ticket, session, paragon_prize.tokenId)
    }
}
const handleErrorSendReward = async (err: any, ticket: Ticket, session: ClientSession, tokenId?: string) => {
    try {
        console.log(err)
        const message = err.message ? err.message : err
        let [transactionHash, blockNumber, status] = ["", 0, false]
        if (err.receipt) {
            transactionHash = err.receipt.transactionHash
            blockNumber = err.receipt.blockNumber
            status = err.receipt.status
        }
        const timestamp = await getTimestampFromBlock(blockNumber)
        const error = {
            txid: transactionHash,
            blockNumber,
            status,
            message,
            timestamp,
            tokenId,
        }
        await tickets.updateOne({ _id: ticket._id }, { $set: { error }}, { session })
        if (tokenId) {
            await paragons_prize.updateOne({ tokenId }, {$set: { error }}, { session })
        }
    } catch (e) {
        throw e
    }
}
