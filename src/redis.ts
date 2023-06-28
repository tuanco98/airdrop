import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import { errorConsoleLog, successConsoleLog } from './color-log';
import { config_REDIS_URI } from './config'


export let redis: RedisClient
export let redisAdmin: RedisClient
export let subRedis: RedisClient
export let keysAsync: (pattern: string) => Promise<string[]>
export let getAsync: (key: string) => Promise<string | null>
export let setAsync: (key: string, val: string) => Promise<any>
export let setExAsync: (key: string, seconds: number, value: string) => Promise<any>
export let expireAsync: (key: string, seconds: number) => Promise<any>
export let existsAsync: (keys: string[]) => Promise<number>
export let ttlAsync: (key: string) => Promise<number>
export let delAsync: (key: string) => Promise<number>
export let incrByAsync: (key: string, amount: number) => Promise<number>;


export const initRedis = async () => {
    try {
        await new Promise<void>((resolve, reject) => {
            redis = createClient({
                url: config_REDIS_URI,
                no_ready_check: false,
                enable_offline_queue: true,
                max_attempts: 1000,
                retry_max_delay: 1000,
            })
            redis.on('connect', function () {
                successConsoleLog('🚀 redis: ready');
                keysAsync = promisify(redis.KEYS).bind(redis)
                getAsync = promisify(redis.GET).bind(redis);
                setAsync = promisify(redis.SET).bind(redis)
                setExAsync = promisify(redis.SETEX).bind(redis)
                expireAsync = promisify(redis.EXPIRE).bind(redis)
                existsAsync = promisify(redis.EXISTS).bind(redis)
                ttlAsync = promisify(redis.TTL).bind(redis)
                delAsync = promisify(redis.DEL).bind(redis)
                incrByAsync = promisify(redis.INCRBY).bind(redis)
                resolve()
            })

            redis.on('error', function (err) {
                errorConsoleLog('❌ redis: connect fail ' + err.message + ` at: ${new Date().toString()}`);
                reject()
            })
        })
    } catch (e) {
        throw e
    }

}

export const initRedisSubExpire = async () => {
    try {
        await new Promise<void>((resolve, reject) => {
            redis = createClient({
                url: config_REDIS_URI,
                no_ready_check: false,
                enable_offline_queue: true,
                max_attempts: 1000,
                retry_max_delay: 1000,
            })
            redis.on('connect', function () {
                successConsoleLog('🚀 redis: connected');
                getAsync = promisify(redis.GET).bind(redis);
                setAsync = promisify(redis.SET).bind(redis)
                setExAsync = promisify(redis.SETEX).bind(redis)
                expireAsync = promisify(redis.EXPIRE).bind(redis)
                existsAsync = promisify(redis.EXISTS).bind(redis)
                ttlAsync = promisify(redis.TTL).bind(redis)
                delAsync = promisify(redis.DEL).bind(redis)
                incrByAsync = promisify(redis.INCRBY).bind(redis)
                resolve()
            })

            redis.on('error', function (err) {
                errorConsoleLog('❌ redis: connect fail ' + err.message + ` at: ${new Date().toString()}`);
                reject()
            })

            redis.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], SubscribeExpired)

            function SubscribeExpired(e, r) {
                subRedis = createClient({
                    url: config_REDIS_URI,
                    no_ready_check: false,
                    enable_offline_queue: true,
                    max_attempts: 1000,
                    retry_max_delay: 1000,
                })
                const expired_subKey = '__keyevent@' + "0" + '__:expired'
                subRedis.subscribe(expired_subKey, function () {
                    console.log(' [i] Subscribed to "' + expired_subKey + '" event channel : ' + r)
                    subRedis.on('message', async function (change, msg) {
                        console.log(msg)
                    })
                })
            }

        })
    } catch (e) {
        throw e
    }

}

export const deletePrefixRedis = async (redis:RedisClient,prefix:string) => {
    redis.KEYS("")
}


