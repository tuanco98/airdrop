import { IndexDescription, ObjectId } from "mongodb";

interface Reward {
    rewardAt: number;
    reward_to_address: string
    reward_txid: string
    blockNumber: number
}
export interface ParagonPrize {
    _id?: ObjectId;
    tokenId: string;
    rank_prize: number;
    created_at: number
    isReward: boolean;
    reward_info?: Reward
}
export const ParagonPrizeIndexes: IndexDescription[] = [
    { key: { tokenId: 1 }, unique: true, background: true},
    { key: { created_at: 1}, background: true},
    { key: { rank_prize: 1 }, background: true},
    { key: { isReward: 1 }, background: true},
]