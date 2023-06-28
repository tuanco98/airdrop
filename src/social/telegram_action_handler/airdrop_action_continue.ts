
import { getTeleUserStep, setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler"
import { airdropData } from "../../mongo"
import { AirdropData } from "../../types/AirdropData"
import { bot, bot_script, Steps } from "../telegram"

export const airdrop_action_continue = async (userId: string, userFirstName: string, chatId: string | number) => {
    try {
        const userStep = await getTeleUserStep(userId)
        let userData: AirdropData | null
        console.log(userStep)
        switch (userStep) {
            case Steps.welcome: {
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.WelcomeMessage(userFirstName),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.welcome
                    })
                break;
            }
            case Steps.enter_address:
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.RequireAddressMessage(userFirstName),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_address
                    })
                break;
            case Steps.enter_telegram_username:
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.enter_telegram_username(userFirstName),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_join_telegram
                    })
                break;
            case Steps.enter_twitter_username:
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.enter_twitter_username,
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_twitter_user_name
                    })
                break;
            case Steps.enter_retweet_link:
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.enter_retweet_link(),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.require_retweet_link
                    })
                break;
            case Steps.pending_status:
                await bot.telegram.sendMessage(
                    chatId,
                    bot_script.message.pending(userFirstName),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.pending
                    })
            case Steps.active_status:
                 userData = await airdropData.findOne({ telegram_id: userId })
                if (userData && userData.acceptedAt) {
                    bot.telegram.sendMessage(chatId, bot_script.message.ending(userFirstName, userData), {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        // reply_markup: bot_script.reply_markup.active
                    })
                }
            case Steps.finish:
                userData = await airdropData.findOne({ telegram_id: userId })
                if (userData && userData.txid) {

                    bot.telegram.sendMessage(chatId, bot_script.message.finish(userData), {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
                }
            default:
                break;
        }

    } catch (e) {
        ErrorNotification(e, { userFirstName, chatId }, airdrop_action_continue.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.cancel
            })
    }
}