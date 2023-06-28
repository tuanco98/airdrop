import { SERVER_CODE_REDIS } from "./config"
import { Reward } from "./models/UserData"
import { ioredis } from "./redis"

export const setAirdropReward = async (address: string, value: Reward) => {
    try {
        const key = `the_parallel.${SERVER_CODE_REDIS}.airdrop_reward_paraart.${address}`
        const result = await ioredis.set(key, JSON.stringify(value))
        return result
    } catch (e) {
        throw e
    }
}

export const getAirdropReward = async (address: string) => {
    try {
        const key = `the_parallel.${SERVER_CODE_REDIS}.airdrop_reward_paraart.${address}`
        const result = await ioredis.get(key)
        if (result) {
            return JSON.parse(result) as Reward
        }
        return null
    } catch (e) {
        throw e
    }
}
export const delAirdropReward = async (address: string) => {
    try {
        const key = `the_parallel.${SERVER_CODE_REDIS}.airdrop_reward_paraart.${address}`
        const result = await ioredis.del(key)
        return result
    } catch (e) {
        throw e
    }
}
export const setCacheParagonReward = async (code_ticket: string, tokenId: number) => {
    try {
        const key = `the_parallel.${SERVER_CODE_REDIS}.airdrop_reward_paragon.${code_ticket}`
        const result = await ioredis.set(key, tokenId)
        return result
    } catch (e) {
        throw e
    }
}

export const getCacheParagonReward = async (code_ticket: string) => {
    try {
        const key = `the_parallel.${SERVER_CODE_REDIS}.airdrop_reward_paragon.${code_ticket}`
        const result = await ioredis.get(key)
        if (result) {
            return JSON.parse(result) as number
        }
        return null
    } catch (e) {
        throw e
    }
}