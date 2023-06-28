import { IndexDescription, ObjectId } from "mongodb"
export interface TransactionError {
    txid: string
    blockNumber: number
    timestamp: number
    status: boolean
    message?: string
}
export interface Reward {
    txid: string
    blockNumber: number
    result: any
    timestamp: number
}
interface AnswerLog {
    question_id: string
    answer_id: string
}
export interface UserData {
    _id?: ObjectId
    address: string
    ticket_count: number
    friends_invited: number
    unbox_results?: number[]
    ref_code: string
    createdAt: number
    is_active: boolean
    refill_energy: number
    para_art_copy: number
    is_pass_squizz: boolean
    is_unbox: boolean
    is_reweet_link_correct: boolean
    last_update_at: number
    pass_squizz_at?: number
    unbox_at?: number
    quote_tweet_link?: string
    submit_quote_link_at?: number
    ref_by: string
    hashed_prize?: string
    error?: TransactionError
    reward_info?: Reward
    ip_address?: string
    answer_log?: AnswerLog
}
export const UserDataIndexes: IndexDescription[] = [
    { key: { address: 1 }, unique: true, background: true },
    { key: { createdAt: 1 }, background: true },
    { key: { ref_code: 1 }, background: true },
    { key: { is_unbox: 1, is_active: 1, para_art_copy: 1, error: 1, reward_info: 1 }, background: true },
]
