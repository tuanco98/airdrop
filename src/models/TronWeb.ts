type TronAccount = {
    address: {
        base58: string
        hex: string
    },
    privateKey: string
    publicKey: string
}

type Transaction = {
    txID: string
    raw_data: {
        data: string
        contract: any[]
        ref_block_bytes: string
        ref_block_hash: string,
        expiration: number,
        timestamp: number
    }
    raw_data_hex: string
    visible: boolean
    signature: string[]
}

type GetTransactionResponse = {
    ret: { contractRet: string }[], //SUCCESS || ???
    signature: string[],
    txID: string,
    raw_data: {
        contract: Object[][],
        ref_block_bytes:string,
        ref_block_hash: string,
        expiration: number,
        fee_limit: number,
        timestamp: number
    },
    raw_data_hex: string
}

type SentTxResult = {
    result: boolean
    txid: string
    transaction: Transaction
}

export interface TronWebType {
    /**
     * Object that allows you to convert between hex / base58 and privatekey representations of a TRON address.
     */
    address: {
        /**
         * Convert Base58 format addresses to Hex
         * @params address-base58 format
         * @returns string
         */
        toHex: (addressInBase58: string) => string,
        /**
        * Convert Hex string format address to Base58 format address
        * @params address-hex string format
        * @returns string
        */
        fromHex: (addressInHex: string) => string,
        /**
       * Derive its corresponding address based on the private key
       * @params privateKey
       * @returns string
       */
        fromPrivateKey: (privateKey: string) => string,
    },
    /**
    * Generate a new privatekey + address combination. This account is not activated on the network.
    * @returns Object
    */
    createAccount: () => TronAccount
    /**
    * Converts a number, or a string of numbers, into a hexadecimal string.
    * @params Number|String - number
    * @returns string
    */
    fromDecimal: (value: string | number) => string
    /**
    * Helper function that will convert a value in SUN to TRX. (1 SUN = 0.000001 TRX)
    * @params Number|String - number
    * @returns string
    */
    fromSun: (value: string | number) => string
    /**
    * Convert a hexadecimal to a decimal number
    * @params String-Hex string
    * @returns Number-The hexadecimal value represented by the passed in string.
    */
    toDecimal: (value: string) => number
    /**
    * Helper function that will convert UTF8 to HEX
    * @params Number|String - number
    * @returns string
    */
    fromUtf8: (value: string) => string
    /**
    * Will return all events within a transactionID.
    * @params Number|String - number
    * @returns string
    */
    getEventByTransactionID: (transactionId: string) => Promise<object[]>

    /**
    * Returns all events matching the filters.
    * @params String Object
    * @returns Promise Object(Array)
    */
    getEventResult: (contractAddress: string, options: object, callback) => Promise<object[]>

    /**
     * Checks if TronWeb is connected to the nodes and event server.
     */
    isConnected: () => Promise<{ fullNode: boolean, solidityNode: boolean, eventServer: boolean }>
    /**
     * Helper function that will check if a given address is valid.
     * @params string
     * @returns boolean
     */
    isAddress: (address: string) => boolean
    trx: {
        /**
         * Get account information
         * @params string (HexString or Base58)
         * @returns Object
         */
        getAccount: (address: string) => Promise<Object>
        /**
         * Get the account's bandwidth and energy resources.
         * @params string (HexString or Base58)
         * @returns Object
         */
        getAccountResources: (address: string) => Promise<Object>
        /**
         * Get the account's balance of TRX, and display the TRX balance in SUN
         * @params string (HexString or Base58)
         * @returns Number
         */
        getBalance: (address: string) => Promise<number>
        /**
         * Query the Bandwidth information for the account.
         * @params string (HexString or Base58)
         * @returns Object
         */
        getBandwidth: (address: string) => Promise<number>
         /**
         * Query the transaction information by transaction id.
         * @params txid string 
         * @returns Object
         */
        getTransaction: (txid: string) => Promise<GetTransactionResponse>
        /**
         * Broadcasts a signed raw transaction to the network.
         * @params signedTransaction The signed transaction object - JSON
         * @returns Object
         */
        sendRawTransaction: (signedTransaction: object) => Promise<SentTxResult>
        /**
        * Signs a provided transaction object.
        * @params unSignedTransaction - The unsigned transaction object - JSON
        * @params privateKey - Private Key associated with the transaction - String
        * @returns Object
        */
        sign: (unSignedTransaction: object, privateKey: string) => Promise<Transaction>
        /**
      * Sends TRX from one address to another. Will create and broadcast the transaction if a private key is provided.
      * @params to - Address to send TRX to, converted to a hex string. - Hex String
      * @params amount - Amount of TRX to send (units in SUN) - String
      * @params privateKey - Optionally provide a private key to sign the transaction. If left blank, will use the address associated with the private key.
      * @returns Object
      */
        sendTransaction: (to: string, amount: number, privateKey?: string) => Promise<SentTxResult>
    }
    contract: () => { at: (contractAddress: string) => any }
    transactionBuilder: {
        /**
         * Creates an unsigned TRX transfer transaction
         * @params to - Address to send TRX to, converted to a hex string - hex String
         * @params amount - Amount of TRX (units in SUN) to send - integer (units in SUN)
         * @params from - Optional address that is transferring the Tokens. If left blank, will use the address associated with the private key - hex String
         * @params options - The permissions Id - hex String
         * @returns Object
         */
        sendTrx: (to: string, amount: number, from?: string, options?) => Promise<Object>
        /**
         * Creates an unsigned TRC10 token transfer transaction
         * @params to - Address to send TRX to, converted to a hex string - hex String
         * @params amount - Amount of TRX (units in SUN) to send - integer (units in SUN)
         * @params from - Optional address that is transferring the Tokens. If left blank, will use the address associated with the private key - hex String
         * @params tokenID - Name of the token, matching the exact capitalization - string
         * @params options - The permissions Id - hex String
         * @returns Object
         */
        sendToken: (to: string, amount: number, tokenID: string, from?: string, options?) => Promise<Object>
        /**
       * Signs a provided transaction object.
       * @params unSignedTxn - The unsigned transaction object - JSON
       * @params msg - Message to send with - String
       * @params type - message type  - String
       * @returns Object
       */
        addUpdateData: (unSignedTxn: object, msg: string, type: "utf8") => Promise<Object>

    }
    defaultAddress: any
}