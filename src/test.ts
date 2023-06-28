import BN from "bn.js"
import { randomBytes } from "crypto"
import { getAnswerCorrectAnticheat, setAnswerCorrectAnticheat } from "./cache"
import {
    config_MINIMUM_DEPOSIT,
    config_PROJECT_END_TIMESTAMP,
    config_PROJECT_START_TIMESTAMP,
    config_SERVER_NAME,
    config_TAG_LINE_ANTICHEAT,
} from "./config"
import { startCheckUserDeposit, totalHoldRemaining } from "./cron/cron-check-deposit"
import { connectMongo, mongo, tickets } from "./mongo"
import { initRedis } from "./redis"
import { get_balance } from "./service/get_balance"
import { AirdropTelegramBotScript } from "./telegramMessage"
import { create_refcode, create_ticket } from "./utils"
import shortid from "shortid"
import { TicketSource, TicketStatus } from "./models/ticket"
import { cronCheckTicketDepositGenerateLater } from "./cron/cron-check-ticket-deposit-generate-later"
;(async () => {
    try {
        for (let i = 0; i < 100; i++) {
            console.log(create_ticket())
        }
    } catch (e) {
        throw e
    }
})()
