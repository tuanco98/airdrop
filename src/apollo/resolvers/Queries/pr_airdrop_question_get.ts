import { questions } from "../../../mongodb"

export const pr_airdrop_question_get = async (root: any, args: any) => {
    try {
        const get_questions = await questions.find().sort({createdAt: -1}).toArray()
        const question_random = Math.floor(Math.random() * get_questions.length)
        const result = get_questions[question_random]
        return result
    } catch (e) {
        throw e
    }
}