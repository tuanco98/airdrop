export enum ReasonType {
    unbox = `unbox`,
    answer=`answer`,
    refer= `refer`,
}
export enum TypeBot {
    reward_paraart_copy = 'reward_paraart_copy',
    reward_paragon = 'reward_paragon'
}
export interface RefcodePartner {
    partner: string
    ref_code: string
}