import { IndexDescription, ObjectId } from "mongodb"
interface TransactionError {
    txid: string
    blockNumber: number
    timestamp: number
    status: boolean
    message?: string
    tokenId?: string
}
export interface Ticket {
    _id?: ObjectId
    address: string
    code: string
    is_win_prize: boolean
    is_claimed_prize: boolean
    claimedAt?: number
    prize_rank?: number
    createdAt: number
    mint_prize_txid?: string
    mint_prize_timestamp?: number
    error?: TransactionError
}
export const TicketIndexes: IndexDescription[] = [
    { key: { code: 1 }, unique: true, background: true },
    { key: { address: 1 }, background: true },
    { key: { createdAt: 1 }, background: true },
    { key: { code: 1, is_win_prize: 1 }, background: true },
    { key: { is_win_prize: 1, is_claimed_prize: 1, mint_prize_txid: 1, error: 1 }, background: true },
]
