import { IndexDescription } from "mongodb";

export interface ParaartCopy {
    hashed: string
    amount: number;
    createdAt: number;
}
export const ParaartCopyIndexes: IndexDescription[] = [
    { key:{hashed: 1}, unique: true, background: true},
    { key:{createdAt: 1}, background: true},
]