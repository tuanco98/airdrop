import { enableBotReward } from "../../.."
import { ADMIN_KEY } from "../../../config"
import { TypeBot } from "../../../models/TypeCommon"
interface InputParam {
    bot_type: TypeBot
    enable: boolean
}
export const pr_airdrop_admin_enable_bot = async (root: any, args: any, ctx: any) => {
    try {
        const { bot_type, enable } = args as InputParam
        const { adminkey } = ctx.req.headers
        const _admin_key = ADMIN_KEY.split(",")
        if (!_admin_key.includes(adminkey)) throw new Error("PERMISSION_MISSING")
        enableBotReward(bot_type, enable)
        const status = enable ? "TURN ON" : "TURN OFF"
        console.log(bot_type, ":", status)
        return {
            bot: bot_type,
            status,
        }
    } catch (e) {
        throw e
    }
}
