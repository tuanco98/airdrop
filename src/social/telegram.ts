
import { Telegraf } from "telegraf"
import { getTeleUserStep } from "../cache"
import { config_ADMIN_KEY, config_TELEGRAM_BOT_TOKEN, config_PROJECT_AIRDROP_NAME, config_PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK, config_PROJECT_AIRDROP_TELEGRAM_GROUP_LINK, config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK, config_PROJECT_AIRDROP_TWITTER_PAGE_LINK, config_PROJECT_AIRDROP_TWITTER_PAGE_USERNAME, config_PROJECT_TELEGRAM_CHANNEL_ID, config_PROJECT_TELEGRAM_GROUP_ID, config_PROJECT_END_TIMESTAMP, config_PROJECT_FACEBOOK_AIRDROP_POST_LINK, config_PROJECT_FACEBOOK_PAGE_LINK } from "../config"
import { airdropData } from "../mongo"
import { AirdropTelegramBotScript } from "../telegramMessage"
import { airdrop_action_confirm_cancel } from "./telegram_action_handler/airdrop_action_confirm_cancel"
import { airdrop_action_continue } from "./telegram_action_handler/airdrop_action_continue"
import { air_drop_default_handler } from "./telegram_message_handler/air_drop_default_handler"
import { air_drop_enter_address_handler } from "./telegram_message_handler/air_drop_enter_address_handler"
import { air_drop_enter_retweet_link_handler } from "./telegram_message_handler/air_drop_enter_retweet_link_handler"
import { air_drop_confirm_join_telegram_group_handler } from "./telegram_message_handler/air_drop_confirm_join_telegram_group_handler"
import { air_drop_enter_twitter_username_handler } from "./telegram_message_handler/air_drop_enter_twitter_username_handler"
import { air_drop_finish_handler } from "./telegram_message_handler/air_drop_finish_handler"
import { air_drop_pending_handler } from "./telegram_message_handler/air_drop_pending_handler"
import { air_drop_start_handler } from "./telegram_message_handler/air_drop_start_handler"
import { air_drop_welcome_handler } from "./telegram_message_handler/air_drop_welcome_handler"
import { isMaintain, setMaintain } from "../maintain"
import { airdrop_command_check_event_status } from "./telegram_command_handler/airdrop_command_check_event_status"
import { ErrorNotification } from "../error_handler"
import { air_drop_enter_discord_username } from "./telegram_message_handler/air_drop_enter_discord_username"
import { air_drop_enter_youtube_email } from "./telegram_message_handler/air_drop_enter_youtube_email"
import { successConsoleLog } from "../color-log"
import { airdrop_command_check_last_error } from "./telegram_command_handler/airdrop_command_check_last_error"
import { air_drop_facebook_link_handler } from "./telegram_message_handler/air_drop_facebook_link_handler"
import { air_drop_facebook_share_handler } from "./telegram_message_handler/air_drop_facebook_share_handler"
import { air_drop_active_status_message_handler } from "./telegram_message_handler/air_drop_active_status_message_handler"

export const botCommands = {
    start: "/start",
    // checkMyRequest: "/check_my_request",
    checkEventStatus: "/check_event_status",
    checkLastError: "/check_last_error",
    // adminCheckEventStatus: "/admin_check_event_status",
    cancel: "/cancel"
}
export const Steps = {
    welcome: 'welcome',
    enter_telegram_username: 'enter_telegram_user',
    enter_facebook_link: 'enter_facebook_link',
    enter_facebook_share_link: 'enter_facebook_share_link',
    enter_twitter_username: 'enter_twitter_username',
    enter_retweet_link: 'enter_retweet_link',
    enter_discord_username: 'enter_discord_username',
    enter_youtube_email: 'enter_youtube_email',
    enter_address: 'enter_address',
    cancel_request: 'cancel_request',
    check_request: 'check_request',
    pending_status: 'pending_status',
    active_status: 'active_status',
    finish: 'finish'
}
export let data: any = {}
export const bot = new Telegraf(config_TELEGRAM_BOT_TOKEN)
export const bot_script = new AirdropTelegramBotScript({
    airdrop_name: config_PROJECT_AIRDROP_NAME,
    end_time: "unknown",
    give_away_tweet_url: config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK,
    facebook_airdrop_post_url: config_PROJECT_FACEBOOK_AIRDROP_POST_LINK,
    facebook_page_url: config_PROJECT_FACEBOOK_PAGE_LINK,
    tele_channel_url: config_PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK,
    tele_group_url: config_PROJECT_AIRDROP_TELEGRAM_GROUP_LINK,
    twitter_page_url: config_PROJECT_AIRDROP_TWITTER_PAGE_LINK,
    twitter_page_username: config_PROJECT_AIRDROP_TWITTER_PAGE_USERNAME
})
export const initTelegramBot = async () => {
    bot.start(async (ctx) => {
        try {
            if (isMaintain) {
                await bot.telegram.sendMessage(
                    ctx.chat.id,
                    bot_script.message.server_maintain(),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
                return;
            }

            if (ctx.message.chat.type === "group" || ctx.message.chat.type === "supergroup") {
                return
            }

            const userId = ctx.from?.id.toString() || ""
            const userFirstName = ctx.from?.first_name || ""
            const chatId = ctx.chat?.id || ""
            await air_drop_start_handler(userId, userFirstName, chatId)
        } catch {
            bot.telegram.sendMessage(ctx.chat.id, bot_script.message.error)
        }
    })

    bot.action(bot_script.callback_data.confirm_cancel, async (ctx) => {
        try {
            const userId = ctx.from?.id.toString() || ""
            const userFirstName = ctx.from?.first_name || ""
            const chatId = ctx.chat?.id || ""
            await airdrop_action_confirm_cancel(userId, userFirstName, chatId)
        } catch (e) {
            bot.telegram.sendMessage(ctx.chat?.id || "", bot_script.message.error)
        }
    })

    bot.action(bot_script.callback_data.reject_cancel, async (ctx) => {
        try {
            const userId = ctx.from?.id.toString() || ""
            const userFirstName = ctx.from?.first_name || ""
            const chatId = ctx.chat?.id || ""
            await airdrop_action_continue(userId, userFirstName, chatId)
        } catch (e) {
            bot.telegram.sendMessage(ctx.chat?.id || "", bot_script.message.error)
        }
    })

    bot.on("message", async (ctx) => {
        try {
            if (ctx.message['left_chat_member']) {
                let left_chat_member_id = ctx.message['left_chat_member'].id
                if (ctx.from.id === config_PROJECT_TELEGRAM_GROUP_ID) {
                    await airdropData.findOneAndUpdate({ telegram_id: left_chat_member_id }, { $set: { is_join_telegram_group: false } })
                }
                if (ctx.from.id === config_PROJECT_TELEGRAM_CHANNEL_ID) {
                    await airdropData.findOneAndUpdate({ telegram_id: left_chat_member_id }, { $set: { is_join_telegram_channel: false } })
                }
                return
            }
            if (ctx.message.chat.type === "group" || ctx.message.chat.type === "supergroup") {
                console.table(ctx.from)
                console.table(ctx.chat)
                return
            }

            const message = ctx.message['text']
            const userId = ctx.from.id.toString()

            const userFirstName = ctx.from.first_name
            const chatId = ctx.chat.id
            if (message === `/${config_ADMIN_KEY}`) {
                setMaintain(!isMaintain)
                await bot.telegram.sendMessage(
                    ctx.chat.id,
                    `BotMaintainStatus=${isMaintain}`
                )
                return;
            }
            if (isMaintain) {
                await bot.telegram.sendMessage(
                    ctx.chat.id,
                    bot_script.message.server_maintain(),
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
                return;
            }
            if (message === botCommands.checkEventStatus) {
                await airdrop_command_check_event_status(message, userId, userFirstName, chatId)
                return;
            }
            if (message === botCommands.checkLastError) {
                await airdrop_command_check_last_error(message, userId, userFirstName, chatId)
                return;
            }
            const now = +new Date()
            if (now > config_PROJECT_END_TIMESTAMP) {
                await bot.telegram.sendMessage(
                    ctx.chat.id,
                    bot_script.message.event_end,
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                    })
                return;
            }
            if (message === bot_script.button_message.cancel) {
                await bot.telegram.sendMessage(
                    ctx.chat.id,
                    bot_script.message.cancel,
                    {
                        parse_mode: "Markdown",
                        disable_web_page_preview: true,
                        reply_markup: bot_script.reply_markup.cancel
                    })
                return;
            }
            const userStep = await getTeleUserStep(userId)
            switch (userStep) {
                case Steps.welcome:
                    await air_drop_welcome_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_facebook_link:
                    await air_drop_facebook_link_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_facebook_share_link:
                    await air_drop_facebook_share_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_telegram_username:
                    await air_drop_confirm_join_telegram_group_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_twitter_username:
                    await air_drop_enter_twitter_username_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_retweet_link:
                    await air_drop_enter_retweet_link_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_discord_username:
                    await air_drop_enter_discord_username(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_youtube_email:
                    await air_drop_enter_youtube_email(message, userId, userFirstName, chatId)
                    break;
                case Steps.pending_status:
                    await air_drop_pending_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.finish:
                    await air_drop_finish_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.enter_address:
                    await air_drop_enter_address_handler(message, userId, userFirstName, chatId)
                    break;
                case Steps.active_status:
                    await air_drop_active_status_message_handler(message, userId, userFirstName, chatId)
                    break;
                default:
                    await air_drop_default_handler(message, userId, userFirstName, chatId)
                    break;
            }
        } catch (e: any) {
            ErrorNotification(e, {}, initTelegramBot.name)
        }
    }

    )
    await bot.launch()

    successConsoleLog(`🚀 Telegram bot: ready`)
}


