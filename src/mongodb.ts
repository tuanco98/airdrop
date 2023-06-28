import { MongoClient, Db, Collection } from 'mongodb'
import { successConsoleLog } from './color-log'

let mongo: MongoClient

export let test: Collection<any>

const collections = {
    test: 'test',
}

const connectMongo = async (MONGO_URI: string) => {
    try {
        console.log('MONGO_URI', MONGO_URI)
        
        mongo = new MongoClient(MONGO_URI)

        await mongo.connect()

        mongo.on('error', async (e) => {
            try {
                await mongo.close()
                await connectMongo(MONGO_URI)
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('timeout', async () => {
            try {
                await mongo.close()
                await connectMongo(MONGO_URI)
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('close', async () => {
            try {
                await connectMongo(MONGO_URI)
            } catch (e) {
                throw e
            }
        })
        const db = mongo.db()

        await Promise.all([
            
        ])
        
        successConsoleLog(`🚀 mongodb: connected`)
    } catch (e) {
        console.error(`mongodb: disconnected`)
        await mongo?.close(true)
        setTimeout(connectMongo, 1000)
        throw e
    }
}

export { mongo, connectMongo, collections }


