import { IndexSpecification } from "mongodb"

export type CampaignOption = {
    telegram?: {
        groupId?: string
    }
}

export type Campaign = {
    id: string
    name: string
    type: string
    createdAt: Date
    startedAt?: Date
    endedAt?: Date
    setSentAmount: number
    message: string
    totalAmountSentInSun: number
    totalNumberSent: number
    tokenId?: string
    requireSocial: CampaignOption
}

export const CampaignIndexes: IndexSpecification[] = [
    { key: { id: 1, "requireSocial.telegram.groupId": 1 },partialFilterExpression: { "requireSocial.telegram.groupId": { $exists: true } }, unique: true, background: true },
    { key: { id: 1 }, unique: true, background: true },
    { key: { name: 1 }, background: true },
    { key: { setAmount: 1 }, background: true },
    { key: { message: 1 }, background: true },
    { key: { totalAmountSent: 1 }, background: true },
    { key: { totalNumberSent: 1 }, background: true },
    { key: { createdAt: -1 }, background: true },
    { key: { tokenId: -1 }, background: true },
]