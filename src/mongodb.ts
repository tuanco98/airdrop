import { MongoClient, Collection } from 'mongodb'
import { successConsoleLog } from './color-log'
import { Question, QuestionIndexes } from './models/Question'
import { ParaartCopy, ParaartCopyIndexes } from './models/ParaartCopy'
import { Ticket, TicketIndexes } from './models/Ticket'
import { UserData, UserDataIndexes } from './models/UserData'
import { ParagonPrize, ParagonPrizeIndexes } from './models/ParagonPrize'

let mongo: MongoClient

export let questions: Collection<Question>
export let tickets: Collection<Ticket>
export let user_datas: Collection<UserData>
export let paraart_copys: Collection<ParaartCopy>
export let paragons_prize: Collection<ParagonPrize>

const collections = {
    questions: 'questions',
    tickets: 'tickets',
    user_datas: 'user_datas',
    paraart_copys: 'paraart_copys',
    paragons_prize: 'paragons_prize',
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
        questions = db.collection(collections.questions)
        tickets = db.collection(collections.tickets)
        user_datas = db.collection(collections.user_datas)
        paraart_copys = db.collection(collections.paraart_copys)
        paragons_prize = db.collection(collections.paragons_prize)
        await Promise.all([
            questions.createIndexes(QuestionIndexes),
            tickets.createIndexes(TicketIndexes),
            user_datas.createIndexes(UserDataIndexes),
            paraart_copys.createIndexes(ParaartCopyIndexes),
            paragons_prize.createIndexes(ParagonPrizeIndexes),
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


