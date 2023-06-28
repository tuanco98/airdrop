import { ReasonType } from "./TypeCommon";

interface UnboxType {
    result: [number]
    time_key: number
}
export interface LogDetail {
    address: string
    createdAt: number
    data: UnboxType
    reason: ReasonType
}