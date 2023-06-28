import { config } from "dotenv";
config();

//SERVER CONFIG
if (!process.env.NODE_ENV) throw new Error(`NODE_ENV must be provided`);
export const config_NODE_ENV: string = process.env.NODE_ENV;
if (!process.env.SERVER_CODE) throw new Error(`SERVER_CODE must be provided`);
export const config_SERVER_CODE: string = process.env.SERVER_CODE;
if (!process.env.SERVER_NAME) throw new Error(`SERVER_NAME must be provided`);
export const config_SERVER_NAME: string = process.env.SERVER_NAME;

//REDIS CONFIG
if (!process.env.REDIS_URI) throw new Error(`REDIS_URI must be provided`);
export const config_REDIS_URI: string = process.env.REDIS_URI;

//MONGO CONFIG
if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`);
export const config_MONGO_URI: string = process.env.MONGO_URI;


//SENTRY CONFIG
if (!process.env.SENTRY_DNS) throw new Error(`SENTRY_DNS must be provided`)
export const config_SENTRY_DNS = process.env.SENTRY_DNS
if (!process.env.SENTRY_SERVER_NAME) throw new Error(`SENTRY_SERVER_NAME must be provided`)
export const config_SENTRY_SERVER_NAME = process.env.SENTRY_SERVER_NAME





//TWIT CONFIG
if (!process.env.TWITTER_APPLICATION_CONSUMER_KEY) throw new Error(`TWITTER_APPLICATION_CONSUMER_KEY must be provided`)
export const config_TWITTER_APPLICATION_CONSUMER_KEY = process.env.TWITTER_APPLICATION_CONSUMER_KEY
if (!process.env.TWITTER_APPLICATION_CONSUMER_SECRET) throw new Error(`TWITTER_APPLICATION_CONSUMER_SECRET must be provided`)
export const config_TWITTER_APPLICATION_CONSUMER_SECRET = process.env.TWITTER_APPLICATION_CONSUMER_SECRET
if (!process.env.TWITTER_ACCESS_TOKEN) throw new Error(`TWITTER_ACCESS_TOKEN must be provided`)
export const config_TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) throw new Error(`TWITTER_ACCESS_TOKEN_SECRET must be provided`)
export const config_TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET
if (!process.env.TWITTER_BEARER_TOKEN) throw new Error(`TWITTER_BEARER_TOKEN must be provided`)
export const config_TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN

//TELEGRAM CONFIG

if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error(`TELEGRAM_BOT_TOKEN must be provided`)
export const config_TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN


//OTHER CONFIG


if (!process.env.GOOGLE_API_KEY) throw new Error(`GOOGLE_API_KEY must be provided`)
export const config_GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
if (!process.env.DISCORD_BOT_TOKEN) throw new Error(`DISCORD_BOT_TOKEN must be provided`)
export const config_DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

if (!process.env.PROJECT_TELEGRAM_GROUP_ID) throw new Error(`PROJECT_TELEGRAM_GROUP_ID must be provided`)
export const config_PROJECT_TELEGRAM_GROUP_ID = parseInt(process.env.PROJECT_TELEGRAM_GROUP_ID)
if (!process.env.PROJECT_TELEGRAM_CHANNEL_ID) throw new Error(`PROJECT_TELEGRAM_CHANNEL_ID must be provided`)
export const config_PROJECT_TELEGRAM_CHANNEL_ID = parseInt(process.env.PROJECT_TELEGRAM_CHANNEL_ID)
if (!process.env.PROJECT_DISCORD_SERVER_ID) throw new Error(`PROJECT_DISCORD_SERVER_ID must be provided`)
export const config_PROJECT_DISCORD_SERVER_ID = process.env.PROJECT_DISCORD_SERVER_ID

if (!process.env.PROJECT_AIRDROP_NAME) throw new Error(`PROJECT_AIRDROP_NAME must be provided`)
export const config_PROJECT_AIRDROP_NAME = process.env.PROJECT_AIRDROP_NAME
if (!process.env.PROJECT_AIRDROP_TELEGRAM_GROUP_LINK) throw new Error(`PROJECT_AIRDROP_TELEGRAM_GROUP_LINK must be provided`)
export const config_PROJECT_AIRDROP_TELEGRAM_GROUP_LINK = process.env.PROJECT_AIRDROP_TELEGRAM_GROUP_LINK
if (!process.env.PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK) throw new Error(`PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK must be provided`)
export const config_PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK = process.env.PROJECT_AIRDROP_TELEGRAM_CHANNEL_LINK
if (!process.env.PROJECT_AIRDROP_TWITTER_PAGE_LINK) throw new Error(`PROJECT_AIRDROP_TWITTER_PAGE_LINK must be provided`)
export const config_PROJECT_AIRDROP_TWITTER_PAGE_LINK = process.env.PROJECT_AIRDROP_TWITTER_PAGE_LINK
if (!process.env.PROJECT_AIRDROP_TWITTER_PAGE_USERNAME) throw new Error(`PROJECT_AIRDROP_TWITTER_PAGE_USERNAME must be provided`)
export const config_PROJECT_AIRDROP_TWITTER_PAGE_USERNAME = process.env.PROJECT_AIRDROP_TWITTER_PAGE_USERNAME
if (!process.env.PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK) throw new Error(`PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK must be provided`)
export const config_PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK = process.env.PROJECT_AIRDROP_TWITTER_GIVEAWAY_LINK

if (!process.env.PROJECT_FACEBOOK_AIRDROP_POST_LINK) throw new Error(`PROJECT_FACEBOOK_AIRDROP_POST_LINK must be provided`)
export const config_PROJECT_FACEBOOK_AIRDROP_POST_LINK = process.env.PROJECT_FACEBOOK_AIRDROP_POST_LINK
if (!process.env.PROJECT_FACEBOOK_PAGE_LINK) throw new Error(`PROJECT_FACEBOOK_PAGE_LINK must be provided`)
export const config_PROJECT_FACEBOOK_PAGE_LINK = process.env.PROJECT_FACEBOOK_PAGE_LINK

if (!process.env.PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK) throw new Error(`PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK must be provided`)
export const config_PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK = process.env.PROJECT_AIRDROP_YOUTUBE_CHANNEL_LINK

if (!process.env.PROJECT_AIRDROP_YOUTUBE_CHANNEL_ID) throw new Error(`PROJECT_AIRDROP_YOUTUBE_CHANNEL_ID must be provided`)
export const config_PROJECT_AIRDROP_YOUTUBE_CHANNEL_ID = process.env.PROJECT_AIRDROP_YOUTUBE_CHANNEL_ID

if (!process.env.PROJECT_AIRDROP_DISCORD_SERVER_LINK) throw new Error(`PROJECT_AIRDROP_DISCORD_SERVER_LINK must be provided`)
export const config_PROJECT_AIRDROP_DISCORD_SERVER_LINK = process.env.PROJECT_AIRDROP_DISCORD_SERVER_LINK
if (!process.env.PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED) throw new Error(`PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED must be provided`)
export const config_PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED = process.env.PROJECT_AIRDROP_TWITTER_HASHTAG_REQUIRED.split(",").map(el => el.toLowerCase())
if (!process.env.PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED) throw new Error(`PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED must be provided`)
export const config_PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED = parseInt(process.env.PROJECT_AIRDROP_TWITTER_NUMBER_FRIEND_TAG_REQUIRED)
if (!process.env.PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS) throw new Error(`PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS must be provided`)
export const config_PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS = parseInt(process.env.PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS)
if (!process.env.PROJECT_END_TIMESTAMP) throw new Error(`PROJECT_END_TIMESTAMP must be provided`)
export const config_PROJECT_END_TIMESTAMP = parseInt(process.env.PROJECT_END_TIMESTAMP)

if (!process.env.ADMIN_KEY) throw new Error(`ADMIN_KEY must be provided`)
export const config_ADMIN_KEY = process.env.ADMIN_KEY
if (!process.env.IS_MAINTAIN) throw new Error(`IS_MAINTAIN must be provided`)
export const config_IS_MAINTAIN = JSON.parse(process.env.IS_MAINTAIN)

if (!process.env.TELEGRAM_ADMIN_WHITELIST) throw new Error(`TELEGRAM_ADMIN_WHITELIST must be provided`)
export const config_TELEGRAM_ADMIN_WHITELIST = process.env.TELEGRAM_ADMIN_WHITELIST.split(",")

//BSC CONFIG
if (!process.env.BSC_NODE) throw new Error(`BSC_NODE must be provided`)
export const config_BSC_NODE = process.env.BSC_NODE
if (!process.env.BSC_BLOCK_EXPLORER_URL_MAIN) throw new Error(`BSC_BLOCK_EXPLORER_URL_MAIN must be provided`)
export const config_BSC_BLOCK_EXPLORER_URL_MAIN = process.env.BSC_BLOCK_EXPLORER_URL_MAIN
if (!process.env.BSC_BLOCK_EXPLORER_URL_TESTNET) throw new Error(`BSC_BLOCK_EXPLORER_URL_TESTNET must be provided`)
export const config_BSC_BLOCK_EXPLORER_URL_TESTNET = process.env.BSC_BLOCK_EXPLORER_URL_TESTNET
if (!process.env.BSC_PROVIDER_MAINNET) throw new Error(`BSC_PROVIDER_MAINNET must be provided`)
export const config_BSC_PROVIDER_MAINNET = process.env.BSC_PROVIDER_MAINNET
if (!process.env.BSC_PROVIDER_TESTNET) throw new Error(`BSC_PROVIDER_TESTNET must be provided`)
export const config_BSC_PROVIDER_TESTNET = process.env.BSC_PROVIDER_TESTNET
if (!process.env.BSC_SCAN_API_KEY) throw new Error(`BSC_SCAN_API_KEY must be provided`)
export const config_BSC_SCAN_API_KEY = process.env.BSC_SCAN_API_KEY