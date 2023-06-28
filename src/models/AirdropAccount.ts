import { Double, IndexSpecification } from "mongodb";

export type UserSocial = {
    telegram?: {
        userId: string
        isJoinGroup?:boolean
    }
}

interface AirdropAccount {
    airdropCampaignId: string
    trxAddress: string,
    isSent: Boolean,
    sentAmount: Double,
    sentAt?: Date
    sentAtTimestamp?: Double
    createdAt: Date
    createdAtTimestamp: Double
    social: UserSocial
}

const AirdropAccountIndexes: IndexSpecification[] = [
    { key: { isSent: 1 }, background: true },
    { key: { sentAmount: 1 }, background: true },
    { key: { sentAt: 1 }, background: true },
    { key: { createdAt: 1 }, background: true },
    { key: { airdropCampaignId: 1, trxAddress: 1 }, unique: true, background: true }
]

export {
    AirdropAccount,
    AirdropAccountIndexes
}