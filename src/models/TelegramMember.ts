import { IndexSpecification } from "mongodb"

export enum TelegramMemberStatus {
    joined = "joined",
    left = "left"
}
export type TelegramMember = {
    groupId: string
    groupTitle: string
    username: string
    userId: string
    userFirstName: string
    userLastName?: string
    status: TelegramMemberStatus
    lastJoinAt: Date
    lastLeftAt?: Date
    createdAt: Date
    isSync: Boolean
}

export const TelegramMemberIndexes: IndexSpecification[] = [
    { key: { groupId: 1 }, background: true },
    { key: { username: 1 }, background: true },
    { key: { userId: 1 }, background: true },
    { key: { status: 1 }, background: true },
    { key: { lastJoinAt: 1 }, background: true },
    { key: { lastLeftAt: 1 }, background: true },
    { key: { createdAt: 1 }, background: true },
]