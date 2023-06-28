import { ErrMsg, ErrorHandler, ERROR_CODE, validateMissing } from "../../../error_handle"
import { mongo, questions, user_datas } from "../../../mongodb"
import { verifySignature } from "../../../service/verify_signature"
import { isEventReady } from "../../../utils"

interface InputParam {
    signed_message: string
    signature: string
    address: string
    question_id: string
    answer_id: string
    ref?: string
}
export const pr_airdrop_answer_user = async (root: any, args: any) => {
    const session = mongo.startSession()
    try {
        const { signed_message, signature, address, question_id, answer_id, ref } = args as InputParam
        validateMissing({ signed_message, signature, address, question_id, answer_id })
        const timestamp = new Date().getTime()
        isEventReady(timestamp)
        const verify = verifySignature(signed_message, signature, address)
        if (!verify) throw ErrMsg(ERROR_CODE.SIGNED_MESSAGE_INVALID)
        let result = false
        await session.withTransaction(async () => {
            const get_questions = await questions.findOne({ question_id })
            if (!get_questions) return
            if (answer_id === get_questions.correct_answer) {
                const timestamp = new Date().getTime()
                await user_datas.updateOne(
                    { address },
                    {
                        $set: {
                            last_update_at: timestamp,
                            is_pass_squizz: true,
                            pass_squizz_at: timestamp,
                            answer_log: {
                                question_id,
                                answer_id
                            }
                        },
                    },
                    { session }
                )
                result = true
            }
        })
        return result
    } catch (e: any) {
        if (session.inTransaction()) await session.abortTransaction()
        if (e.name === "MongoError" || e.code === 112) {
            if (session.inTransaction()) await session.endSession()
            return pr_airdrop_answer_user(root, args)
        }
        ErrorHandler(e, args, pr_airdrop_answer_user.name)
        throw e
    } finally {
        if (session.inTransaction()) await session.endSession()
    }
}
