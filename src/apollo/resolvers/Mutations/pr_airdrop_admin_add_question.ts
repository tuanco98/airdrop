import { v4 } from "uuid"
import { ADMIN_KEY } from "../../../config"
import { mongo, questions } from "../../../mongodb"
export const pr_airdrop_admin_add_question = async (root: any, args: any, ctx: any) => {
    const session = mongo.startSession()
    try {
        const { question, answers, correct_answer } = args as {
            question: string
            answers: string[]
            correct_answer: number
        }

        const { admin_key } = ctx.req.headers
        const _admin_key = ADMIN_KEY.split(",")
        if (!_admin_key.includes(admin_key)) throw new Error("PERMISSION_MISSING")
        let result: any
        await session.withTransaction(async () => {
            const new_question = question.toLowerCase().trim()
            const is_exist = await questions.findOne({ question_slug: new_question }, { session })
            if (is_exist) throw new Error("QUESTION_IS_EXIST")
            const _answer = answers.map((el: string) => {
                return {
                    answer: el.trim(),
                    id: v4(),
                }
            })
            const question_id = v4()
            result = await questions.insertOne(
                {
                    question_id,
                    question: question.trim(),
                    question_slug: new_question,
                    answers: _answer,
                    correct_answer: _answer[correct_answer].id,
                    createdAt: new Date().getTime(),
                    last_update_at: new Date().getTime(),
                },
                { session }
            )
        })
        return result
    } catch (e) {
        if (session.inTransaction()) await session.abortTransaction()
        throw e
    } finally {
        await session.endSession()
    }
}
