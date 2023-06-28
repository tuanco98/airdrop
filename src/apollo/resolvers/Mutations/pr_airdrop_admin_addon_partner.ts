import { ADMIN_KEY } from "../../../config"
import { validateMissing } from "../../../error_handle"
import { mongo, user_datas } from "../../../mongodb"

interface InputParam {
    partner_name: string
    ref_code: string
}
export const pr_airdrop_admin_addon_partner = async (root: any, args: any, ctx: any) => {
    const session = mongo.startSession()
    try {
        const { partner_name, ref_code } = args as InputParam
        const { admin_key } = ctx.req.headers
        validateMissing({ partner_name, ref_code })
        const _admin_key = ADMIN_KEY.split(",")
        if (!_admin_key.includes(admin_key)) throw new Error("PERMISSION_MISSING")
        let result: any
        await session.withTransaction(async () => {
            const is_exist = await user_datas.findOne({ ref_code: ref_code.trim().toLowerCase() }, { session })
            if (is_exist) throw new Error("ref_code is exist")
            await user_datas.insertOne(
                {
                    address: partner_name,
                    is_pass_squizz: false,
                    is_unbox: false,
                    is_reweet_link_correct: false,
                    is_active: true,
                    ticket_count: 0,
                    friends_invited: 0,
                    ref_code: ref_code.toLowerCase(),
                    refill_energy: 0,
                    para_art_copy: 0,
                    createdAt: new Date().getTime(),
                    last_update_at: new Date().getTime(),
                    ref_by: "generate",
                },
                { session }
            )
            result = {
                message: 'success',
                partner_name,
                ref_code,
            }
        })
        return result
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
    }
}
