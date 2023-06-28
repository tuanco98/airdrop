import { web3 } from "../web3";

export const verifySignature = (message: string, signature: string, sender: string): boolean => {
    try {
        const verifyAddress = web3.eth.accounts.recover(message, signature);
        return verifyAddress === sender;
    } catch (e) {
        return false;
    }
};
