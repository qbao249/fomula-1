import * as dotenv from 'dotenv'
// for .env works
dotenv.config()

export const MONGO_DB_URL = process.env.MONGO_DB_URL
export const MONGO_DB_LOCAL_URL = process.env.MONGO_DB_LOCAL_URL

export const NODE_ENV = process.env.NODE_ENV

function isInt(n: any) {
  return !isNaN(parseInt(n)) && isFinite(n)
}
console.log('PORT before:', process.env.PORT)

export const PORT = isInt(process.env.PORT) ? parseInt(process.env.PORT ?? '') : 5000
