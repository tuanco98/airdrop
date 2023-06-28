import Web3 from "web3";
import { config_BSC_PROVIDER_MAINNET } from "./config";

export let web3 = new Web3(config_BSC_PROVIDER_MAINNET)

export const isBSCWallet = (address: string) => {
    return web3.utils.isAddress(address)
}

