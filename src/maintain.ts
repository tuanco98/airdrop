import { config_IS_MAINTAIN } from "./config"

export let isMaintain:boolean=config_IS_MAINTAIN
export const setMaintain=(value:boolean)=>{
    isMaintain=value
    return isMaintain
}