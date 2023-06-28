import { ForceReply, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "telegraf/typings/core/types/typegram"
import { config_PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED, config_PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED, config_PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK, config_PROJECT_AIRDROP_DISCORD_SERVER_LINK, config_BSC_NODE, config_PROJECT_FACEBOOK_AIRDROP_POST_LINK } from "./config"
import { AirdropData } from "./types/AirdropData"
import { getIdFacebookPageLink, getPostIdFromFacebookShareLink } from "./utils"

type ReplyMarkup = {
    welcome: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_address: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_facebook_link: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_facebook_share_link: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_join_telegram: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_twitter_user_name: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_retweet_link: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_discord_username: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    require_youtube_email: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    pending: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    active: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    cancel: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    finish: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    check_event_status: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    unknown_command: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
    error_missing_data: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply
}
export class AirdropTelegramBotScript {
    public link = {
        support_get_channel_id: "https://support.google.com/youtube/answer/3250431?hl=en",
        support_get_discord_id: "https://www.alphr.com/discord-find-user-id/"
    }
    public _airdropName: string
    public _tele_channel_url: string
    public _facebook_airdrop_post_url: string
    public _facebook_page_url: string
    public _tele_group_url: string
    public _twitter_page_url: string
    public _twitter_page_username: string
    public _airdrop_tweet_url: string
    public _discord_server_url: string = config_PROJECT_AIRDROP_DISCORD_SERVER_LINK
    public _youtube_channel_url: string = config_PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK
    public _end_time: string
    public _hashtag: string[] = config_PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED
    public _number_friend_tag_require: number = config_PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED
    public button_message = {
        ready: "👍 I’m ready to submit my details",
        check: "🔎 I want to check my request status",
        cancel: "🚫 Cancel",
        active: "ACTIVATE",
        confirm_join: "I have joined THE PARALLEL telegram channel and group",
        confirm_cancel: "👍 Confirm",
        reject_cancel: "😭 No",
        continue: "Continue"
    }
    public callback_data = {
        confirm_cancel: `confirm_cancel`,
        reject_cancel: `reject_cancel`
    }
    public reply_markup: ReplyMarkup = {
        welcome: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.ready }]],
        },
        require_address: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_join_telegram: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.confirm_join }], [{ text: this.button_message.cancel }]],
        },
        require_facebook_link: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_facebook_share_link: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_twitter_user_name: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_retweet_link: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_discord_username: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        require_youtube_email: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        error_missing_data: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [[{ text: this.button_message.cancel }]],
        },
        pending: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            keyboard: [
                [{ text: this.button_message.check }],
                [{ text: this.button_message.cancel }],
            ],
        },
        active: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            // keyboard: [[{ text: this.button_message.active }]],
        },
        cancel: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            inline_keyboard: [
                [{ text: this.button_message.confirm_cancel, callback_data: this.callback_data.confirm_cancel }, { text: this.button_message.reject_cancel, callback_data: this.callback_data.reject_cancel }],

            ]
        },
        check_event_status: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            inline_keyboard: [
                [{ text: this.button_message.continue, callback_data: this.callback_data.reject_cancel }],

            ]
        },
        unknown_command: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            inline_keyboard: [
                [{ text: this.button_message.continue, callback_data: this.callback_data.reject_cancel }],

            ]
        },
        finish: {
            resize_keyboard: true,
            force_reply: true,
            one_time_keyboard: true,
            // keyboard: [[{ text: this.button_message.active }]],
        },
    }

    constructor(params: { airdrop_name: string, end_time: string, facebook_airdrop_post_url: string, tele_channel_url: string, tele_group_url: string, twitter_page_url: string, twitter_page_username: string, give_away_tweet_url: string, facebook_page_url: string }) {
        this._airdropName = params.airdrop_name
        this._facebook_airdrop_post_url = params.facebook_airdrop_post_url
        this._facebook_page_url = params.facebook_page_url
        this._tele_channel_url = params.tele_channel_url
        this._tele_group_url = params.tele_group_url
        this._twitter_page_url = params.twitter_page_url
        this._airdrop_tweet_url = params.give_away_tweet_url
        this._end_time = params.end_time
        this._twitter_page_username = params.twitter_page_username
    }


    public WelcomeMessage = (username: string) => `Hello *${username}*!  I am going to walk you through the steps to get your *${this._airdropName}*
   
    🏆 Total reward: 60,000 PRL
    ⚡️ Get 20 PRL for Joining
    ⭐️ Airdrop program starts from December 1, 2021 to December 15, 2021.
    ✅ Complete the following steps to be eligible for the airdrop
   
    ✏️ *STEPS* 
    🔸 On Facebook, like and comment on Airdrop Post and tag 5 friends in that comment.
    🔸 Share the Airdrop post on Facebook to your News Feed in public.
    🔸 Join our Telegram Channel.
    🔸 Join our community on Telegram Group.
    🔸 Follow on Twitter
    🔸 Like and retweet this Airdrop Tweet. 
    🔸 Join our community on Discord Server.
    🔸 Subscribe our Youtube Channel.
    🔸 Submit your BEP-20 wallet address.

    *Note:* 
    ✔️ All steps are mandatory and will be automatically verified.
    ✔️ Your wallet address must be BEP-20 wallet address.
    ✔️ Each wallet address can only be received once in the program.
    ✔️ Only use one Twitter account, one Telegram account, one Discord account and one Youtube account. If we detect you use more than one, your results will be forfeited.
    ✔️ 3000 lucky users will be randomly selected to receive the airdrop
    \n*When you ready to start please click to "${this.button_message.ready}" or reply "${this.button_message.ready}"*`
    public RequireAddressMessage = (username: string) => `🤗 Finally, please submit your BEP-20 wallet address. \n\n_Reminder_ :\n_- Your wallet address must be BEP-20 wallet address_`
    public RequireJoinChannelAndGroupTelegram = () => `🤗 Next, please join our [Channel](${this._tele_channel_url}) and [Group](${this._tele_group_url}).\n\nOnce complete, reply _"${this.button_message.confirm_join}"_.`
    public RequireFollowTwitter = () => `🤗 Next, Please follow [THE PARALLEL](${this._twitter_page_url}) on Twitter.
    \nAfter that, enter your Twitter username.`
    public RequireRetweet = () => `🤗 Next, give us a like and quote tweet this Airdrop [Tweet](${this._airdrop_tweet_url}) and tag ${this._number_friend_tag_require} friends with tag ${this._hashtag.map(el => `#${el}`)}.
    \n\nAfter that, paste in the URL for your retweet.`

    public message = {
        error_missing_data: `Sorry, there was a network problem happened! Please resubmit your details!`,
        error: `ℹ️ Server is down, please try again!`,
        out_of_energy: ``,
        must_join_warning: () => `❌ You have to join our [Telegram Channel](${this._tele_channel_url}) and [Telegram Group](${this._tele_group_url}) to take the next steps`,
        must_subscribe_warning: () => `❌ You have to subscribe our [Youtube Channel](${this._youtube_channel_url}) to take the next steps. Once complete enter your youtube channel ID`,
        must_join_discord_server_warning: () => `❌ You have to join our [Discord Server](${this._discord_server_url}) to take the next steps. Once complete enter your discord user ID`,
        invalid_address: `❌ Your wallet address is invalid.`,
        in_used_address: `❌ This address is already used. Try with another wallet address!`,
        inactive_address: `❌ This address must be *ACTIVE* before Oct 11th, 2021. Please try with another wallet address!`,
        invalid_username: `❌ Your username is invalid. It must start with @.\nExample: @theparallel.`,
        in_use_username: `❌ This username is already used! \n\nPlease insert another twitter username!`,
        invalid_discord_username: `❌ Your discord username is invalid.\n _Example: theparallel#1234_\n\nPlease insert valid username again!`,
        in_use_discord_username: `❌ This discord username is already used! \n\nPlease insert another discord username!`,
        invalid_youtube_email: `❌ Your email is invalid.\n _Example: example@theparallel.io _\n\nPlease insert valid email again!`,
        in_use_youtube_email: `❌ This email id is already used! \n\nPlease insert another email!`,
        invalid_facebook_link: `❌ Your Facebook link is invalid, please try again!\n _Example: https://www.facebook.com/username or https://www.facebook.com/profile?id=your-id _`,
        in_use_facebook_link: `❌ Your Facebook link has already been used, please try again!`,
        invalid_facebook_share_link: (fb_user_id: string) => `❌ The URL of your sharing post is invalid, please try again!\n For valid example: \n✅ https://www.facebook.com/${fb_user_id}/posts/post-id \n✅ https://m.facebook.com/story.php?story_fbid=post-id&id=${fb_user_id}\n✅ https://m.facebook.com/story.php?story_fbid=post-id&id=${fb_user_id}&m_entstream_source=permalink\n✅https://www.facebook.com/permalink.php?story_fbid=post-id&id=${fb_user_id} `,
        in_use_facebook_share_link: `❌ The URL of your sharing post has already been used, please try again!`,
        invalid_link: (tweet_username: string) => `❌ Your quote tweet link is invalid \nExample: https://<twitter.com || mobile.twitter.com || www.twitter.com>/${tweet_username}/status/<tweet-id>\n\nPlease insert your valid retweet link again!`,
        in_use_link: `❌ Your retweet link was already used! \n\nPlease insert your another quote tweet link!`,
        waiting_processing: `Our system is handling your request, please wait in few seconds`,
        cancel: `Are you sure you want to cancel?`,
        checkEventStatus: (activeUser: number, totalUser: number, totalFailFollowTwitter: number, totalFailQuoteTweet: number, totalFailLikeTweet: number, totalLikeTweet: number) => `Total joined: ${totalUser} users.\nTotal actived: ${activeUser} users.\nTotal fail follow: ${totalFailFollowTwitter} users.\nTotal fail quote retweet: ${totalFailQuoteTweet} users\nTotal fail like tweet: ${totalFailLikeTweet} users\nTotal like tweet: ${totalLikeTweet} users`,
        checkLastError: (message: string) => message,
        admin_check: (totalRequest: number, totalFail: number, totalPass: number, totalPending: number, totalReceived: number) => `Hello Admin 🤵,\n-📋 Total request:${totalRequest}.\n-❌ Total failed request: ${totalFail} \n-⏳ Total pending request: ${totalPending}\n-🍻 Total accepted request: ${totalPass}\n`,
        unknown_command: `❌ Unknown Command!

You have sent a Message directly into the Bot's chat or
Menu structure has been modified by Admin.
        
ℹ️ Do not send Messages directly to the Bot or
reload the Menu by pressing /start`,
        start: `What can this bot do?\nOfficial *Giveaway* bot.\n\nStart the bot and follow the steps to complete the requirements.`,
        welcome: (username: string) => this.WelcomeMessage(username),
        enter_address: (username: string) => this.RequireAddressMessage(username),
        enter_facebook_link: (username: string) => `*${username}*, Now let's get started, on Facebook, please Like and Comment on [Airdrop Post](${this._facebook_airdrop_post_url}) and tag 5 friends in that comment.\n\n📝Then please enter your Facebook link\nExample: https://www.facebook.com/username or https://www.facebook.com/profile?id=your-id`,
        enter_facebook_share_link: (fb_user_id: string) => `🤗 Next, Please share the [Airdrop Post](${this._facebook_airdrop_post_url}) on Facebook to your News Feed in public.\n\n📝Then please enter the URL of your sharing post\nExample: https://www.facebook.com/username/posts/post-id `,
        enter_telegram_username: (username: string) => `🤗 Next, please join our [Telegram Channel](${this._tele_channel_url}) and [Telegram Group](${this._tele_group_url}).`,
        enter_twitter_username: this.RequireFollowTwitter(),
        enter_retweet_link: () => `🤗 Next, give us a like and quote tweet this [Airdrop Tweet](${this._airdrop_tweet_url}) and tag ${this._number_friend_tag_require} friends with tag ${this._hashtag.map(el => `#${el}`)}.\n\nAfter that, paste in the URL for your retweet.`,
        enter_discord_username: () => `🤗 Next, please join our community on [Discord Server](${this._discord_server_url}).
        \nAfter that, enter your Discord Username ...`,
        enter_youtube_email: () => `🤗 Next, please subscribe our [Youtube Channel](${this._youtube_channel_url}).
        \nAfter that, enter your email address which already subscribed our Youtube Channel ...`,
        pending: (username: string) => `👤 User: ${username}\n\n🎉 Your application has been recorded and is being processed. You can track your airdrop process below 👇\n\n_If your submitted data is entered incorrectly, you can resubmit your data by clicking to "${this.button_message.cancel}" button or reply "${this.button_message.cancel}"_\n\n_Or if you want to check your request processing status click to "${this.button_message.check}" button or reply "${this.button_message.check}"_`,
        check: (data: AirdropData) => `🔸 Your Address: ${data.address}\n🔸 Your Twitter Username: @${data.twitter_username}\n🔸 Your Quote Tweet: [click here](${data.retweet_link})\n🔸 Your Discord ID: ${data.discord_username}\n🔸 Your Youtube Channel ID: ${data.youtube_email}\n🔸 Your facebook homepage: [click here](https://www.facebook.com/${data.facebook_id})\n🔸 Your facebook share post: [click here](https://www.facebook.com/${data.facebook_id}/posts/${data.facebook_post_id})\n🕒 Request Time: _${data.requestAt?.toUTCString()}_\n\n*View your Airdrop process:*\n
${data.is_like_and_comment_facebook ? "✔️" : "❌"} Like and comment [Facebook Post](${this._facebook_airdrop_post_url}).\n_Result: ${data.is_like_and_comment_facebook ? "OK" : "you have not like and comment our facebook post"}_
${data.is_share_facebook_post ? "✔️" : "❌"} Share [Facebook Post](${this._facebook_airdrop_post_url}).\n_Result: ${data.is_share_facebook_post ? "OK" : "you have not share facebook post"}_
${data.is_join_telegram_channel ? "✔️" : "❌"} Join our [Telegram Channel](${this._tele_channel_url}).\n_Result: ${data.is_join_telegram_channel ? "OK" : "you have not joined our telegram channel"}_
${data.is_join_telegram_group ? "✔️" : "❌"} Join our [Telegram Group](${this._tele_group_url}).\n_Result: ${data.is_join_telegram_group ? "OK" : "you have not joined our telegram group"}_
${data.is_follow_twitter_page ? "✔️" : data.follow_twitter_fail_reason ? "❌" : "⌛"} Follow our [Twitter](${this._twitter_page_url}).\n_Result: ${data.follow_twitter_fail_reason ? data.follow_twitter_fail_reason === "OK" ? "OK" : `${data.follow_twitter_fail_reason}` : "pending"}_
${data.is_retweet_link_correct ? "✔️" : data.retweet_fail_reason ? "❌" : "⌛"} Quote tweet this Airdrop [Tweet](${this._airdrop_tweet_url}).\n_Result: ${data.retweet_fail_reason ? data.retweet_fail_reason === "OK" ? "OK" : `${data.retweet_fail_reason}` : "pending"}_
${data.is_like_tweet ? "✔️" : data.result_check_like_tweet ? "❌" : "⌛"} Like this Airdrop [Tweet](${this._airdrop_tweet_url}).\n_Result: ${data.result_check_like_tweet ? data.result_check_like_tweet === "OK" ? "OK" : `${data.result_check_like_tweet}` : "pending"}_
${data.is_join_discord_server ? "✔️" : data.result_check_join_discord ? "❌" : "⌛"} Join discord server [Discord Server](${this._discord_server_url}).\n_Result: ${data.result_check_join_discord ? data.result_check_join_discord === "OK" ? "OK" : `${data.result_check_join_discord}` : "pending"}_
${data.is_subscribe_youtube ? "✔️" : data.result_check_subscribe_youtube ? "❌" : "⌛"} Subscribe our [Youtube](${this._youtube_channel_url}).\n_Result: ${data.result_check_subscribe_youtube ? data.result_check_subscribe_youtube === "OK" ? "OK" : `${data.result_check_subscribe_youtube}` : "pending\n✔️ Submit your BEP-20 wallet address."}_
${(!data.is_join_telegram_channel) || (!data.is_join_telegram_group) || (!data.is_follow_twitter_page && data.follow_twitter_fail_reason) || (!data.is_retweet_link_correct && data.retweet_fail_reason) || (!data.is_like_tweet && data.result_check_like_tweet) ? `\n*Sorry, your request was failed. Click to "${this.button_message.cancel}" button or reply "${this.button_message.cancel}" and resend request when you complete all our task!*.` : ""} \n${data.reject_run_out_of_energy ? `_ ⚠️ Our fund is now full so your request has been queued. Once your request is accepted we will notify you immediately!_` : ""}`,
        ending: (username: string, data?: AirdropData) => `🥳 Congratulations! You have already completed all steps, we will announce the winners on December 16, 2021. Stay tune!`,
        send_airdrop_success: (data: AirdropData) => `You have successfully received Energy.\nReceive Time: _${data.activateAt?.toUTCString()} _\n Hope you will have great experiences at *Airdrop!* 🥰 \n\n*Check your Transaction ID* : [${data.txid}](${config_BSC_NODE === "main" ? `https://tronscan.org` : `https://nile.tronscan.org`}/#/transaction/${data.txid})`,
        send_airdrop_fail: `⚠️ Our fund is temporarily overloaded. please try again later!`,
        finish: (data: AirdropData) => `*You have successfully received 20 PRL. Hope you will have great experiences at THE PARALLEL! 🥰`,
        event_end: `⚠️ Sorry! This event ended already. \nPlease wait our announcement for the winner`,
        server_maintain: () => `🛠️ -  Our bot 🤖 is maintaining. Please try again later! \n\n _Follow the latest updates on our_  [telegram](${this._tele_channel_url}) _channel or_  [twitter](${this._twitter_page_url}) page!`
    }

    public validateUsername = (username: string) => {
        return username.startsWith("@")
    }

    public validate = {
        username: (username: string) => this.validateUsername(username),
        channel_id: (channel_id: string) => channel_id.startsWith("UC"),
        discord_username: (discord_username: string) => {
            const split_discord_username = discord_username.split("#")
            if (split_discord_username.length === 2) {
                const id = discord_username.split("#")[1]
                if (Number.isNaN(Number(id))) return false
                return true
            }
            return false
        },
        email: (email: string) => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email),
        //example facebook link:   https://facebook.com/yourusername or https://facebook.com/profile.php?id=10012345678910)
        facebook_link: (facebook_link: string) => {
            const facebook_id = getIdFacebookPageLink(facebook_link)
            if (facebook_id) return true
            return false
        },
        //example facebook posts:  https://www.facebook.com/parallel/posts/4793957024002468
        facebook_share: (facebook_share: string) => {
            const post_id = getPostIdFromFacebookShareLink(facebook_share)
            if (post_id) return true
            return false
        }
    }
}