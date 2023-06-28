import { API_USER_URL, USER_API_SERVER_KEY } from "../../../config"
import { ErrMsg, ErrorHandler, ERROR_CODE, validateMissing } from "../../../error_handle"
import { ParaartCopy } from "../../../models/ParaartCopy"
import { mongo, paraart_copys, tickets, user_datas } from "../../../mongodb"
import { verifySignature } from "../../../service/verify_signature"
import { create_ticket, httpRequest, isEventReady, random_byte } from "../../../utils"

export const pr_airdrop_unbox = async (root: any, args: any) => {
    const session = mongo.startSession()
    try {
        const { signed_message, signature, address } = args as {
            address: string
            signed_message: string
            signature: string
        }
        validateMissing({ signed_message, signature, address })
        const timestamp = new Date().getTime()
        isEventReady(timestamp)
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)

        let result: any
        await session.withTransaction(async () => {
            const get_user_data = await user_datas.findOne({ address }, { session })
            if (!get_user_data) throw ErrMsg(ERROR_CODE.USER_NOT_EXIST)
            if (get_user_data.is_unbox) throw ErrMsg(ERROR_CODE.USER_HAS_UNBOX)
            if (!get_user_data.is_pass_squizz) throw ErrMsg(ERROR_CODE.USER_MUST_PASS_QUIZZ)
            if (!get_user_data.is_reweet_link_correct) throw ErrMsg(ERROR_CODE.USER_MUST_SHARE_LINK_TWEET)

            const paraarts_copy = await paraart_copys.find({ amount: { $gt: 0 } }, { session }).toArray()
            const ticket = await create_ticket(session)
            const rate_result = paraarts_copy.length > 0 ? random_byte(5) : 0
            const pra_result = rate_result === 1 ? 1 : 0;
            const energy_result = random_byte(4) + 2
            result = [pra_result, energy_result]
            const set_update = { is_unbox: true, unbox_at: timestamp, unbox_results: result, last_update_at: timestamp }
            if (pra_result === 1) {
                const hashed = randomHashedPrize(paraarts_copy)
                set_update["hashed_prize"] = hashed
                await paraart_copys.updateOne({ hashed }, { $inc: { amount: -1 } }, { session })
            }
            await user_datas.updateOne(
                { address },
                {
                    $set: set_update,
                    $inc: { refill_energy: energy_result, para_art_copy: pra_result },
                },
                { session }
            )
            await tickets.insertOne(
                { address, code: ticket, is_claimed_prize: false, is_win_prize: false, createdAt: timestamp },
                { session }
            )
            await httpRequest(API_USER_URL, queryString, {
                address,
                server_key: USER_API_SERVER_KEY,
                value: energy_result,
            })
            if (get_user_data.is_active) {
                const get_ref_user = await user_datas.findOne({ ref_code: get_user_data.ref_by }, { session })
                if (get_ref_user && get_ref_user.address.startsWith("0x")) {
                    const _ticket = await create_ticket(session)
                    await tickets.insertOne(
                        {
                            address: get_ref_user.address,
                            is_win_prize: false,
                            is_claimed_prize: false,
                            code: _ticket,
                            createdAt: timestamp,
                        },
                        { session }
                    )
                    await user_datas.updateOne(
                        { address: get_ref_user.address },
                        { $inc: { ticket_count: 1 }, $set: { last_update_at: timestamp } },
                        { session }
                    )
                }
            }
        })
        return result
    } catch (e: any) {
        if (session.inTransaction()) await session.abortTransaction()
        if (e.name === "MongoError" || e.code === 112) {
            if (session.inTransaction()) await session.endSession()
            return pr_airdrop_unbox(root, args)
        }
        ErrorHandler(e, args, pr_airdrop_unbox.name)
        throw e
    } finally {
        if (session.inTransaction()) await session.endSession()
    }
}
export const randomHashedPrize = (paraarts_copy: ParaartCopy[]) => {
    try {
        const hashes = paraarts_copy.map((el) => el.hashed)
        const random_index = random_byte(hashes.length)
        return hashes[random_index]
    } catch (e) {
        throw e
    }
}
export const queryString = `
mutation pr_user_update_refill_energy($address: String! $server_key: String! $value: Int!){
    pr_user_update_refill_energy(address:$address server_key:$server_key value:$value)
        {
            errorMessage
            errorCode
        }
    }
`
