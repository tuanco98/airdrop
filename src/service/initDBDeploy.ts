import { v4 } from "uuid"
import xlsxFile from 'read-excel-file/node'
import { ClientSession } from "mongodb"
import {
    AMOUNT_PER_HASHED,
    HASHES_PARA_ART_COPY,
    TOKEN_IDS_PRG_THE_SECOND_PRIZE,
    TOKEN_IDS_PRG_THE_THIRD_PRIZE,
    TOKEN_ID_PRG_FIRST_PRIZE,
} from "../config"
import { mongo, paraart_copys, paragons_prize, questions, user_datas } from "../mongodb"
import { QuestionPool } from "../questions"
import { RefcodePartner } from "../models/TypeCommon"

export const initDBDeploy = async () => {
    const session = mongo.startSession()
    try {
        await session.withTransaction(async () => {
            await initQuestion(session)
            await initParaartCopy(session)
            await initRefCode(session)
            await initParagonPrize(session)
        })
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
    }
}
const initQuestion = async (session: ClientSession) => {
    try {
        for (let question_pool of QuestionPool) {
            const question_slug = question_pool.question.trim()
            const is_exist = await questions.findOne({ question_slug: question_slug.toLowerCase() })
            if (!is_exist) {
                const answers = question_pool.answers.map((el: string) => {
                    return {
                        answer: el.trim(),
                        id: v4(),
                    }
                })
                const question_id = v4()
                await questions.insertOne(
                    {
                        question_id,
                        question: question_slug,
                        question_slug: question_slug.toLowerCase(),
                        answers,
                        correct_answer: answers[question_pool.correct_answer].id,
                        createdAt: new Date().getTime(),
                        last_update_at: new Date().getTime(),
                    },
                    { session }
                )
            }
        }
    } catch (e) {
        throw e
    }
}
const initParaartCopy = async (session: ClientSession) => {
    try {
        const hashes = HASHES_PARA_ART_COPY.trim().split(",")
        const amount_per_hash_para_art = Number(AMOUNT_PER_HASHED)
        for (let hash of hashes) {
            const paraart_copy_is_exists = await paraart_copys.findOne({ hashed: hash }, { session })
            if (!paraart_copy_is_exists) {
                await paraart_copys.insertOne(
                    {
                        hashed: hash,
                        createdAt: new Date().getTime(),
                        amount: amount_per_hash_para_art,
                    },
                    { session }
                )
            }
        }
    } catch (e) {
        throw e
    }
}
const initRefCode = async (session: ClientSession) => {
    try {
        const ref_code_partners = await read_file_excel()
        const get_partners = await user_datas.find({ ref_by: 'generate' }, { session }).toArray()
        for (let partner_pool of ref_code_partners) {
            const { ref_code, partner } = partner_pool
            const initialization_ref_code = get_partners.find(el => el.ref_code.toLowerCase() === ref_code.toLowerCase())
            if (!initialization_ref_code) {
                await user_datas.insertOne(
                    {
                        address: partner,
                        is_pass_squizz: false,
                        is_unbox: false,
                        is_reweet_link_correct: false,
                        is_active: true,
                        ticket_count: 0,
                        friends_invited: 0,
                        ref_code: ref_code.toLowerCase(),
                        refill_energy: 0,
                        para_art_copy: 0,
                        createdAt: new Date().getTime(),
                        last_update_at: new Date().getTime(),
                        ref_by: "generate",
                    },
                    { session }
                )
            }
        }
    } catch (e) {
        throw e
    }
}
const initParagonPrize = async (session: ClientSession) => {
    try {
        const token_id_first_prize = TOKEN_ID_PRG_FIRST_PRIZE
        const token_ids_the_second_prize = TOKEN_IDS_PRG_THE_SECOND_PRIZE?.split(",")
        const token_ids_the_third_prize = TOKEN_IDS_PRG_THE_THIRD_PRIZE?.split(",")
        const get_paragons_prize = await paragons_prize.find({}, { session }).toArray()
        const check_first_prize = get_paragons_prize.findIndex((el) => el.tokenId === token_id_first_prize)
        const timestamp = new Date().getTime()
        if (!token_id_first_prize || !token_ids_the_second_prize || !token_ids_the_third_prize) return
        if (check_first_prize < 0) {
            await paragons_prize.insertOne(
                { tokenId: token_id_first_prize, created_at: timestamp, isReward: false, rank_prize: 1 },
                { session }
            )
        }
        for (let tokenId of token_ids_the_second_prize) {
            const check_the_second_prize = get_paragons_prize.findIndex((el) => el.tokenId === tokenId)
            if (check_the_second_prize < 0) {
                await paragons_prize.insertOne(
                    { tokenId, created_at: timestamp, isReward: false, rank_prize: 2 },
                    { session }
                )
            }
        }
        for (let tokenId of token_ids_the_third_prize) {
            const check_the_third_prize = get_paragons_prize.findIndex((el) => el.tokenId === tokenId)
            if (check_the_third_prize < 0) {
                await paragons_prize.insertOne(
                    { tokenId, created_at: timestamp, isReward: false, rank_prize: 3 },
                    { session }
                )
            }
        }
    } catch (e) {
        throw e
    }
}
export const read_file_excel = async () => {
    try {
        let result: RefcodePartner[] = []
        const rows = await xlsxFile('Airdrop Campaign.xlsx', {sheet: 'Code Partner'})
        for (let i in rows){
            const partner = rows[i][0].toString()
            const ref_code = rows[i][1].toString()
            result.push({
                partner,
                ref_code
            })
        }
        return result
    } catch (e) {
        throw e
    }
}