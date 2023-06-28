import { Collection, connect, MongoClient, ReadPreference } from "mongodb";
import { errorConsoleLog, successConsoleLog } from "./color-log";
import { config_MONGO_URI } from "./config";
import { AirdropData, AirdropDataIndexes } from "./types/AirdropData";
import { TwitterLikeTweet, TwitterLikeTweetIndexes } from "./types/TwitterLikeTweet";

let mongo: MongoClient;
export let airdropAccounts: Collection
export let TXs: Collection
export let campaigns: Collection
export let telegramMembers: Collection
export let airdropData: Collection<AirdropData>
export let twitterLikes: Collection<TwitterLikeTweet>

const collections = {
  airdropAccounts: "airdropAccounts",
  TXs: "TXs",
  campaigns: "campaigns",
  telegramMembers: "telegramMembers",
  airdropData: "airdropData",
  twitterLikes:"twitterLikes"
};

const connectMongo = async () => {
  try {
    mongo = await connect(config_MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      ignoreUndefined: true, // find: {xxx: {$exists: false}}
      readPreference: ReadPreference.PRIMARY,
    });

    mongo.on("error", async (e) => {
      try {
        await mongo.close();
        await connectMongo();
      } catch (e) {
        setTimeout(connectMongo, 1000);
        throw e;
      }
    });

    mongo.on("timeout", async () => {
      try {
        await mongo.close();
        await connectMongo();
      } catch (e) {
        setTimeout(connectMongo, 1000);
        throw e;
      }
    });

    mongo.on("close", async () => {
      try {
        await connectMongo();
      } catch (e) {
        throw e;
      }
    });

    const db = mongo.db();
    airdropAccounts = db.collection(collections.airdropAccounts)
    TXs = db.collection(collections.TXs)
    campaigns = db.collection(collections.campaigns)
    telegramMembers = db.collection(collections.telegramMembers)
    airdropData = db.collection(collections.airdropData)
    twitterLikes = db.collection(collections.twitterLikes)
    await Promise.all([
      // airdropAccounts.createIndexes(AirdropAccountIndexes),
      // TXs.createIndexes(TXsIndexes),
      // campaigns.createIndexes(CampaignIndexes),
      // telegramMembers.createIndexes(TelegramMemberIndexes),
      airdropData.createIndexes(AirdropDataIndexes),
      twitterLikes.createIndexes(TwitterLikeTweetIndexes),
    ]);
    successConsoleLog(`🚀 mongodb: ready`);
   
  } catch (e) {
    errorConsoleLog(`mongodb: disconnected`);
    await mongo?.close(true);
    setTimeout(connectMongo, 1000);
    throw e;
  }
};

export { mongo, connectMongo, collections };
