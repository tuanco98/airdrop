import { successConsoleLog } from "./color-log";
import { config_NODE_ENV, config_SERVER_NAME } from "./config";
import { airdropAccounts, airdropData, campaigns, connectMongo, telegramMembers, twitterLikes, TXs } from "./mongo";
import { delAsync, initRedis, keysAsync, redis } from "./redis";

export const reset = async () => {
  try {
    if(config_NODE_ENV==="dev"){

      await initRedis();
      await connectMongo();
      const allKeys = await keysAsync(`${config_SERVER_NAME}.*`)
      allKeys.forEach(async (key) => {
        await delAsync(key)
      })
      successConsoleLog(`${allKeys.length} key(s) was(were) deleted!`);
      const delAccountRes = await airdropAccounts.deleteMany({});
      successConsoleLog(`${delAccountRes.deletedCount} account(s) was(were) deleted!`);
      const delTxRes = await TXs.deleteMany({});
      successConsoleLog(`${delTxRes.deletedCount} TX(s) was(were) deleted!`);
      const delCampRes = await campaigns.deleteMany({});
      successConsoleLog(`${delCampRes.deletedCount} camp(s) was(were) deleted!`);
      const delTeleMemRes = await telegramMembers.deleteMany({});
      successConsoleLog(`${delTeleMemRes.deletedCount} teleMem(s) was(were) deleted!`);
      const delAirdropData = await airdropData.deleteMany({});
      successConsoleLog(`${delAirdropData.deletedCount} airdrop form(s) was(were) deleted!`);
      const delLikeData = await twitterLikes.deleteMany({});
      successConsoleLog(`${delLikeData.deletedCount} like(s) was(were) deleted!`);
      successConsoleLog(`__DONE__`)
    } else {
      successConsoleLog(`YOU CAN NOT DO THAT`)
    }
    return;
  } catch (e) {
    throw e
  }
};

reset()