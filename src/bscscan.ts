import axios from "axios";
import { BSC_NODE, BSC_SCAN_API_KEY, PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS } from "./config";
/**
 * Limit: 5 request per second and 100,000 API/day
 * @param address 
 * @returns 
 */
export const getFirstTxByAddress = async (address: string) => {
    try {
        const api_BSC_url = BSC_NODE === "mainnet" ? "https://api.bscscan.com" : "https://api-testnet.bscscan.com"
        const url=`${api_BSC_url}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${BSC_SCAN_API_KEY}`
        const Tx = await axios.get(url)
        if (!Tx) return null
        if (Tx.data.status === '1' || Tx.data.result.length !== 0) {
            return Tx.data.result as {
                blockNumber: string
                timeStamp: string
                hash: string
                nonce: string
                blockHash: string
                transactionIndex: string
                from: string
                to: string
                value: string
                gas: string
                gasPrice: string
                isError: string
                txreceipt_status: string
                input: string
                contractAddress: string
                cumulativeGasUsed: string
                gasUsed: string
                confirmations: string
            }[]
        }
        return null
    } catch (e) {
        throw e
    }
}

export const isBSCAddressActiveBefore = async (address: string) => {
    try {
        const firstTx = await getFirstTxByAddress(address)
        if (firstTx) {
            const { timeStamp } = firstTx[0]
            if (Number(timeStamp) < Math.floor(Number(PROJECT_AIRDROP_ADDRESS_ACTIVE_BEFORE_TIMESTAMP_MS) / 1000)) return true
        }
        return false
    } catch (e) {
        throw e
    }
}

