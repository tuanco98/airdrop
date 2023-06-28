import { errorConsoleLog, successConsoleLog } from "../color-log"
import { checkJoinDiscordServer } from "../social/discord"

export const test_discord = async () => {
    try {
        console.log(`...Testing discord func`)
        const result = await checkJoinDiscordServer("903230009068621834")
        if (result === true) {
            successConsoleLog(`[pass] check join discord server func`)
        } else {
            errorConsoleLog(`[fail] check join discord server func `)
            throw new Error(`test_discord not pass`)
        }
    } catch (e) {
        throw e
    }
}