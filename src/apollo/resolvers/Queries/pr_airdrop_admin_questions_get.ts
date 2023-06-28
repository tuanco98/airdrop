import { ADMIN_KEY } from "../../../config"
import { questions } from "../../../mongodb"

export const pr_airdrop_admin_questions_get = async (root: any, args: any, ctx: any) => {
    try {
        const { pageSize, page } = args
        const { admin_key } = ctx.req.headers
        const _admin_key = ADMIN_KEY.split(",")
        if (!_admin_key.includes(admin_key)) throw new Error("PERMISSION_MISSING")
        const _questions = await questions
            .find({})
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ createdAt: -1 })
            .toArray()
        const total = await questions.countDocuments()

        return {
            total,
            questions: _questions
        }
    } catch (e) {
        throw e
    }
}
