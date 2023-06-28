import { SERVER_CODE } from "./config"

const ServerCode = SERVER_CODE

export const validateMissing = (object: any) => {
    let arr = Object.keys(object)
    for (let el of arr) {
        if (object[el] === null || object[el] === undefined || object[el] === "") throw ErrMsg(ERROR_CODE.MISSING_PARAM)
    }
}
export const ErrMsg = (msg: string) => {
    return new Error(`${ServerCode}: ${msg}`)
}
export const ErrCodeMessage = {
    PRL_: "Action fail because unexpected error",
}
export function ErrorHandler(e: any, args: any, funcName: string) {
    const { message } = e
    if (!message.startsWith(`${ServerCode}:`)) {
        console.log('\n========================================================================================\n')
        console.log('\x1b[31m%s\x1b[0m', `🔥  🔥  🔥  DANGER : UNEXPECTED ERROR HAPPENED!\n `)
        console.log('Function:', funcName)
        console.log(e)
        console.log(`Argument:`, JSON.parse(JSON.stringify(args)))
        console.log('\n========================================================================================')
    }
}
export const ERROR_CODE = {
    SUCCESS: '600',
    MISSING_PARAM: '501',
    USER_NOT_EXIST: '502',
    USER_HAS_UNBOX: '503',
    USER_MUST_PASS_QUIZZ: '504',
    USER_MUST_SHARE_LINK_TWEET: '505',
    EVENT_IS_NOT_READY: '506',
    EVENT_HAS_ENDED: '507',
    SIGNED_MESSAGE_INVALID: '508',
    REWEET_LINK_IS_EXIST: '509',
    INACTIVE_ADDRESS: '510',
    USER_HAS_SUBMIT_REFCODE: '511',
    TICKET_HAS_CLAIMED: '512',
}