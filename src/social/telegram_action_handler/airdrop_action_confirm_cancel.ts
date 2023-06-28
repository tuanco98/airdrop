
import { incrTotalAmountActive, setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { bot, bot_script, Steps } from "../telegram"

export const airdrop_action_confirm_cancel = async (userId: string, userFirstName: string, chatId: string | number) => {
    try {
        const delNoAcceptRes = await airdropData.deleteOne({ telegram_id: userId, acceptedAt: { $exists: false } })
        if (!delNoAcceptRes.deletedCount) {
            const delAcceptRes = await airdropData.deleteOne({ telegram_id: userId, acceptedAt: { $exists: true }, txid: { $exists: false } })
            if (delAcceptRes.deletedCount) {
            } else {
                const userData = await airdropData.findOne({ telegram_id: userId })
                if(userData) {
                    bot.telegram.sendMessage(chatId, bot_script.message.finish(userData), {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
                    return
                }
            }
        }
        await setTeleUserStep(userId, Steps.welcome)
        await bot.telegram.sendMessage(chatId, bot_script.message.welcome(userFirstName), { parse_mode: "Markdown", disable_web_page_preview: true, reply_markup: bot_script.reply_markup.welcome })

    } catch (e) {
        ErrorNotification(e, { userFirstName, chatId }, airdrop_action_confirm_cancel.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            })
    }
}