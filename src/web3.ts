import Web3 from "web3"
import { Contract } from "web3-eth-contract"
import { enable_bot_reward_paraart_copy, enable_bot_reward_paragon } from "."
import { Paraart_ABI } from "./abi_contracts/paraart"
import { Paragon_ABI } from "./abi_contracts/paragon"
import { successConsoleLog } from "./color-log"
import {
    CONTRACT_PARAART_ADDRESS,
    CONTRACT_PARAGON_ADDRESS,
    PRIVATE_BOT_REWARD_PARAART_COPY,
    PRIVATE_BOT_REWARD_PARAGON,
    WEB3_PROVIDER_AUTHEN_URI,
} from "./config"
import { TypeBot } from "./models/TypeCommon"

export let web3: Web3
// CONTRACT
export let paraartContract: Contract
export let paragonContract: Contract

// BOT
export let reward_para_art_copy_bot_address: string
export let reward_paragon_bot_address: string

export const connectWeb3 = async () => {
    try {
        const authen_provider = WEB3_PROVIDER_AUTHEN_URI
        web3 = new Web3(authen_provider)

        //init smart contract
        paraartContract = new web3.eth.Contract(Paraart_ABI, CONTRACT_PARAART_ADDRESS)
        paragonContract = new web3.eth.Contract(Paragon_ABI, CONTRACT_PARAGON_ADDRESS)

        // set bot
        web3.eth.accounts.wallet.add(PRIVATE_BOT_REWARD_PARAART_COPY)
        reward_para_art_copy_bot_address = web3.eth.accounts.privateKeyToAccount(
            PRIVATE_BOT_REWARD_PARAART_COPY
        ).address
        web3.eth.accounts.wallet.add(PRIVATE_BOT_REWARD_PARAGON)
        reward_paragon_bot_address = web3.eth.accounts.privateKeyToAccount(PRIVATE_BOT_REWARD_PARAGON).address

        console.table(
            [
                {
                    address: reward_para_art_copy_bot_address,
                    enable: enable_bot_reward_paraart_copy,
                    type_bot: TypeBot.reward_paraart_copy,
                },
                {
                    address: reward_paragon_bot_address,
                    enable: enable_bot_reward_paragon,
                    type_bot: TypeBot.reward_paragon,
                },
            ],
            ["address", "enable", "type_bot"]
        )
        successConsoleLog(`🚀 Web3: connected`)
    } catch (e) {
        throw e
    }
}
