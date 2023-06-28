import { ErrMsg, ERROR_CODE, validateMissing } from "../../../error_handle"
import { tickets, user_datas } from "../../../mongodb"
import { verifySignature } from "../../../service/verify_signature"

interface InputParam {
    signed_message: string
    signature: string
    address: string
    pageSizeTicket?: number
    pageTicket?: number
}
export const pr_airdrop_user_information_get = async (root: any, args: any):Promise<any> => {
    try {
        const { signed_message, signature, address, pageSizeTicket = 0, pageTicket = 0 } = args as InputParam
        validateMissing({ signed_message, signature, address })
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)
        const user_data = await user_datas.findOne({ address })
        const get_tickets = await tickets
            .find({ address })
            .limit(pageSizeTicket)
            .skip(pageSizeTicket * pageTicket)
            .sort({ is_win_prize: -1, code: -1 })
            .toArray()
        const ticket_count = await tickets.countDocuments({address})
        return {
            ...user_data,
            tickets: get_tickets,
            ticket_count,
        }
    } catch (e) {
        throw e
    }
}
