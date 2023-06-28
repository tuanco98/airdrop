import { isBSCAddressActiveBefore } from "../../../bscscan"
import { NODE_ENV } from "../../../config"
import { ErrMsg, ErrorHandler, ERROR_CODE, validateMissing } from "../../../error_handle"
import { mongo, user_datas } from "../../../mongodb"
import { verifySignature } from "../../../service/verify_signature"
import { create_ref_code, isEventReady } from "../../../utils"

interface InputParam {
    signed_message: string
    signature: string
    address: string
    ref_code: string
}
const getRequestIpAddress = (request: any) => {
    const requestIpAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress
    if (!requestIpAddress) return null
    if (NODE_ENV=== 'local') return requestIpAddress.toString()
    const ipv4 = new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)")

    const [ipAddress] = requestIpAddress?.match(ipv4)

    return ipAddress.toString()
}
export const pr_airdrop_submit_ref_code = async (root: any, args: any, ctx: any) => {
    const session = mongo.startSession()
    try {
        let { signed_message, signature, address, ref_code } = args as InputParam
        ref_code = ref_code.trim().toLowerCase()
        const timestamp = new Date().getTime()
        isEventReady(timestamp)
        let result: boolean = true
        validateMissing({ signed_message, signature, address, ref_code })
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)
        const ip = getRequestIpAddress(ctx.req)
        await session.withTransaction(async () => {
            const is_exist = await user_datas.findOne({ address }, { session })
            if (is_exist) throw ErrMsg(ERROR_CODE.USER_HAS_SUBMIT_REFCODE)
            const user = await user_datas.findOne({ ref_code }, { session })
            if (!user) {
                result = false
                return
            }
            let create_ref: string = ""
            while (create_ref === "") {
                const _ref = create_ref_code(address)
                if (_ref.length < 5) continue
                const is_exist = await user_datas.findOne({ ref_code: _ref }, { session })
                if (is_exist) continue
                create_ref = _ref
            }
            // const is_active = await isBSCAddressActiveBefore(address)
            const is_active = true
            const new_data = {
                address,
                is_pass_squizz: false,
                is_unbox: false,
                is_reweet_link_correct: false,
                is_active,
                ticket_count: 0,
                friends_invited: 0,
                ref_code: create_ref.trim(),
                refill_energy: 0,
                para_art_copy: 0,
                ref_count: 0,
                createdAt: timestamp,
                last_update_at: timestamp,
                ref_by: ref_code,
                ip_address: ip
            }
            await user_datas.insertOne(new_data, { session })
            await user_datas.updateOne({ ref_code }, { $inc: { friends_invited: 1 } }, { session })
        })
        return result
    } catch (e: any) {
        if (session.inTransaction()) await session.abortTransaction()
        if (e.name === "MongoError" || e.code === 112) {
            if (session.inTransaction()) await session.endSession()
            return pr_airdrop_submit_ref_code(root, args, ctx)
        }
        ErrorHandler(e, args, pr_airdrop_submit_ref_code.name)
        throw e
    } finally {
        if (session.inTransaction()) await session.endSession()
    }
}
