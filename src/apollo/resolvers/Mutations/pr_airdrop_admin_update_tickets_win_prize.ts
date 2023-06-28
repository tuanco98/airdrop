import { ADMIN_KEY } from "../../../config"
import { validateMissing } from "../../../error_handle"
import { mongo, tickets } from "../../../mongodb"

export const pr_airdrop_admin_update_tickets_win_prize = async (root: any, args: any, ctx: any) => {
    const session = mongo.startSession()
    try {
        const { prize_rank, code_tickets } = args as { prize_rank: number; code_tickets: string[] }
        validateMissing({ prize_rank })
        const { adminkey } = ctx.req.headers
        if (prize_rank < 1) throw new Error("prize_rank is a positive integer")
        const _admin_key = ADMIN_KEY.split(",")
        console.log({_admin_key, adminkey})
        if (!_admin_key.includes(adminkey)) throw new Error("PERMISSION_MISSING")
        let total_success = 0
        let errors: string[] = []
        await session.withTransaction(async () => {
            for (let code of code_tickets) {
                const update_result = await tickets.updateOne(
                    { code: code.trim() },
                    { $set: { is_win_prize: true, prize_rank } },
                    { session }
                )
                if (update_result.modifiedCount === 0) errors.push(code)
                else total_success += 1
            }
        })
        return {
            total_success,
            total_error: errors.length,
            errors,
        }
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
    }
}
