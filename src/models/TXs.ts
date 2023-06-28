import { Double, IndexSpecification } from "mongodb";

export interface TX {
  uuid: string;
  type: string;
  action: string;
  sender: string;
  receiver: string;
  amount: Double;
  fee: Double;
  amountWithFee: Double
  coin: string;
  tokenId?:string
  sentAt: Date;
  sentAtTimestamp: Double;
  txid: string;
  status?: string;
  airdropCampaignId: string
}

export const TXsIndexes: IndexSpecification[] = [
  { key: { uuid: 1 }, unique: true, background: true },
  { key: { type: 1 }, background: true },
  { key: { action: 1 }, background: true },
  { key: { sender: 1 }, background: true },
  { key: { receiver: 1 }, background: true },
  { key: { amount: 1 }, background: true },
  { key: { coin: 1 }, background: true },
  { key: { status: 1 }, background: true },
  { key: { sentAt: 1 }, background: true },
  { key: { airdropCampaignId: 1 }, background: true },
  { key: { txid: 1 }, unique: true, background: true },
]
