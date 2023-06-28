import { ObjectId } from "mongodb"
import { ErrMsg, ErrorHandler, ERROR_CODE, validateMissing } from "../../../error_handle"
import { mongo, tickets } from "../../../mongodb"
import { verifySignature } from "../../../service/verify_signature"
import { isEventReady } from "../../../utils"

interface InputParam {
    address: string
    signed_message: string
    signature: string
    code: string
}
export const pr_airdrop_claim_prize_ticket = async (root: any, args: any) => {
    const session = mongo.startSession()
    try {
        const { signed_message, signature, address, code } = args as InputParam
        validateMissing({ signed_message, signature, address, code })
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)
        let result: boolean = false
        await session.withTransaction(async () => {
            const ticket = await tickets.findOne({ address, code: code.trim() })
            if (!ticket || !ticket.is_win_prize) return
            if (ticket.is_claimed_prize) throw ErrMsg(ERROR_CODE.TICKET_HAS_CLAIMED)
            await tickets.updateOne(
                { address, code: code.trim() },
                { $set: { is_claimed_prize: true, claimedAt: new Date().getTime() } },
                { session }
            )
            result = true
        })
        return result
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        ErrorHandler(e, args, pr_airdrop_claim_prize_ticket.name)
        throw e
    } finally {
        await session.endSession()
    }
}
