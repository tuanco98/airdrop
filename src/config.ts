import { config } from "dotenv"

config()

// SERVER CONFIG
if (!process.env.PORT) throw new Error('PORT must be provided')
export const config_PORT = process.env.PORT
if (!process.env.SERVER_CODE) throw new Error('SERVER_CODE must be provided')
export const config_SERVER_CODE = process.env.SERVER_CODE
if (!process.env.NODE_ENV) throw new Error('NODE_ENV must be provided')
export const config_NODE_ENV = process.env.NODE_ENV

// MONGO CONFIG
if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be provided')
export const config_MONGO_URI = process.env.MONGO_URI

