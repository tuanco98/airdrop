import { CaptureException } from "./sentry"
import { config_NODE_ENV, config_SERVER_CODE } from "./config"

export const ErrMsg = (msg: string) => {
    return new Error(`${config_SERVER_CODE}:${msg}`)
}

export const ErrCodeMessage = {
    BAA000: "Action fail because unexpected error"
}

/**
 * Show the error and capture exception to Sentry
 * @param e error 
 * @param args params of user 
 * @param funcName Name of function
 */

export function ErrorHandler(e: any, args: any, funcName: string) {
    const { message } = e
    const { password, ...params } = args
    if (message.startsWith(`${config_SERVER_CODE}:`) || config_NODE_ENV !== "prod") {
        const errCode = message.substring(0, config_SERVER_CODE.length) + message.substring(config_SERVER_CODE.length + 1);
        console.log('\n========================================================================================\n')
        console.log('\x1b[33m%s\x1b[0m', `⚠️  WARNING : EXPECTED ERROR HAPPENED!\n`)
        console.log('Function:', funcName)
        console.log(e)
        console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
        console.log(`Message:`, ErrCodeMessage[errCode] ? ErrCodeMessage[errCode] : message.substring(config_SERVER_CODE.length + 1))
        console.log('\n========================================================================================')
        throw new Error(message)
    } else {
        console.log('\n========================================================================================\n')
        console.log('\x1b[31m%s\x1b[0m', `🔥  🔥  🔥  DANGER : UNEXPECTED ERROR HAPPENED!\n `)
        console.log('Function:', funcName)
        console.log(e)
        console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
        console.log('\n========================================================================================')
        CaptureException(e, { args: JSON.parse(JSON.stringify(args)) })
        throw ErrMsg(ERROR_CODE.UNEXPECTED_ERROR)
    }
}
export let lastErrorMessage:string
export function ErrorNotification(e: any, args: any, funcName: string) {
   
    CaptureException(e, { args: JSON.parse(JSON.stringify(args)), funcName,date:new Date()})
    console.log('error', e);
    console.log('error args', args);
    console.log('error funcName', funcName);
    
    // lastErrorMessage=JSON.stringify({error:e,args: JSON.parse(JSON.stringify(args)),funcName})
}

export const ERROR_CODE = {
    //==========USER==========
    UNEXPECTED_ERROR: '000',
    INSUFFICIENT_BANDWIDTH: '001'
}