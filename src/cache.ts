
import {
  config_SERVER_NAME,
} from "./config";

import { getAsync, incrByAsync, setAsync } from "./redis";


export const globalRedisKeys = {
  isAdvertisementRun: `${config_SERVER_NAME}.isAdvertisementRun`,
  airdropAmount: `${config_SERVER_NAME}.airdropAmount`,
  campName: `${config_SERVER_NAME}.campName`,
  campMessage: `${config_SERVER_NAME}.campMessage`,
  campId: `${config_SERVER_NAME}.campId`,
  campOptions: `${config_SERVER_NAME}.campOptions`,
  amountFreeze: `${config_SERVER_NAME}.tron_power.amount_freeze`,
  amountActive: `${config_SERVER_NAME}.tron_power.amount_active`
};

export const setAdvertisement = async (value: boolean) => {
  try {
    const key = globalRedisKeys.isAdvertisementRun;
    await setAsync(key, JSON.stringify(value));
    return "OK";
  } catch (e) {
    throw e;
  }
};



export const setTeleUserStep = async (teleUserId: string, step: string) => {
  try {
    const key = `${config_SERVER_NAME}.telegram.${teleUserId}.step`
    await setAsync(key, step);
    return "OK"
  } catch (e) {
    throw e
  }
}

export const getTeleUserStep = async (teleUserId: string) => {
  try {
    const key = `${config_SERVER_NAME}.telegram.${teleUserId}.step`
    const result = await getAsync(key)
    return result || ""
  } catch (e) {
    throw e
  }
}


export const incrTotalAmountFreeze = async (amount: number) => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.amount_freeze`
    const result = await incrByAsync(key, amount)
    return result
  } catch (e) {
    throw e
  }
}

export const setTotalAmountFreeze = async (amount: number) => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.amount_freeze`
    const result = await setAsync(key, amount.toString())
    return result
  } catch (e) {
    throw e
  }
}

export const getTotalAmountFreeze = async () => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.amount_freeze`
    const result = await getAsync(key)
    return result
  } catch (e) {
    throw e
  }
}

export const incrTotalAmountActive = async (amount: number) => {
  try {
    const key = globalRedisKeys.amountActive
    const result = await incrByAsync(key, amount)
    return result
  } catch (e) {
    throw e
  }
}


export const setTotalAmountActive = async (amount: number) => {
  try {
    const key = globalRedisKeys.amountActive
    const result = await setAsync(key, amount.toString())
    return result
  } catch (e) {
    throw e
  }
}

export const getTotalAmountActive = async () => {
  try {
    const key = globalRedisKeys.amountActive
    const result = await getAsync(key)
    return result
  } catch (e) {
    throw e
  }
}

export const setLastLikeUser = async (username: string) => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.airdrop.lastLikeUser`
    const result = await setAsync(key, username)
    return result
  } catch (e) {
    throw e
  }
}


export const getLastLikeUser = async () => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.airdrop.lastLikeUser`
    const result = await getAsync(key)
    return result || ""
  } catch (e) {
    throw e
  }
}


export const setLikedPostUsers = async (usernames: string[]) => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.airdrop.liked_post_users`
    const result = await setAsync(key, JSON.stringify(usernames))
    return result
  } catch (e) {
    throw e
  }
}

export const getLikedPostUsers = async () => {
  try {
    const key = `${config_SERVER_NAME}.tron_power.airdrop.liked_post_users`
    const res = await getAsync(key)
    const result = JSON.parse(res || "[]") as string[]
    return result
  } catch (e) {
    throw e
  }
}

