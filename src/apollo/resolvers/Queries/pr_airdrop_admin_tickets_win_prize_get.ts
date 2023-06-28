import { ADMIN_KEY } from "../../../config"
import { validateMissing } from "../../../error_handle"
import { tickets } from "../../../mongodb"

export const pr_airdrop_admin_tickets_win_prize_get = async (root: any, args: any, ctx: any) => {
    try {
        const { pageSize, page, rank } = args as { page: number; pageSize: number; rank?: number }
        validateMissing({ page, pageSize })
        const { adminkey } = ctx.req.headers
        const _admin_key = ADMIN_KEY.split(",")
        if (!_admin_key.includes(adminkey)) throw new Error("PERMISSION_MISSING")
        const findOptions = {
            prize_rank: !rank ? { $gt: 0 } : rank,
        }
        const get_tickets = await tickets
            .find(findOptions)
            .limit(pageSize)
            .skip(pageSize * page)
            .toArray()
        const total = await tickets.countDocuments(findOptions)
        return {
            total,
            tickets: get_tickets,
        }
    } catch (e) {
        throw e
    }
}
