import { setTeleUserStep } from "../../cache"
import { ErrorNotification } from "../../error_handler";
import { airdropData } from "../../mongo";
import { isBSCWallet } from "../../web3";
import { bot, bot_script, data, Steps } from "../telegram"

export const air_drop_enter_address_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number) => {
    try {
        if (!data[`${userId}`]) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.error_missing_data,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                })
            await setTeleUserStep(userId, Steps.welcome)
            bot.telegram.sendMessage(chatId, bot_script.message.welcome(userFirstName), {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.welcome
            })
            return
        }
        console.log(`${userId}-${userFirstName}: ${message}`)
        if (!isBSCWallet(message)) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.invalid_address,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_address
                })
            return
        }
        // const isActiveBefore=await isBSCAddressActiveBefore(message, config_PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS)
        // if (!isActiveBefore) {
        //     await bot.telegram.sendMessage(
        //         chatId,
        //         bot_script.message.inactive_address,
        //         {
        //             parse_mode: "Markdown",
        //             disable_web_page_preview: true,
        //             reply_markup: bot_script.reply_markup.require_address
        //         })
        //     return
        // }

        data[`${userId}`].address = message
        console.log({ userId: data[`${userId}`] })
        const userData = await airdropData.findOne({ address: message })
        if (userData) {
            await bot.telegram.sendMessage(
                chatId,
                bot_script.message.in_used_address,
                {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: bot_script.reply_markup.require_address
                })
            return
        }
        await setTeleUserStep(userId, Steps.pending_status)
        await airdropData.insertOne({

            telegram_id: userId,
            telegram_first_name: userFirstName,
            address: data[`${userId}`].address,
            retweet_link: data[`${userId}`].retweet_link,
            retweet_id: data[`${userId}`].retweet_id,
            facebook_id: data[`${userId}`].facebook_id,
            facebook_post_id: data[`${userId}`].facebook_post_id,
            twitter_username: data[`${userId}`].twitter_username,
            discord_username: data[`${userId}`].discord_username,
            youtube_email: data[`${userId}`].youtube_email,
            result_check_join_discord: "OK",
            is_share_facebook_post: true,
            is_like_and_comment_facebook: true,
            is_retweet_link_correct: false,
            is_follow_twitter_page: false,
            is_join_discord_server: true,
            is_subscribe_youtube: true,
            is_like_tweet: false,
            is_join_telegram_channel: true,
            is_join_telegram_group: true,
            requestAt: new Date(),
            reject_run_out_of_energy: false
        })
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.pending(userFirstName),
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.pending
            })
    } catch (e) {
        console.log(e)
        ErrorNotification(e, { message, userId, userFirstName, chatId }, air_drop_enter_address_handler.name)
        await bot.telegram.sendMessage(
            chatId,
            bot_script.message.error,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: bot_script.reply_markup.require_address
            })
    }
}