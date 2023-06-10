import { MONGO_DB_LOCAL_URL } from '../env-vars'
import mongoose from 'mongoose'

export const startUnitTest = () => {
  console.log('connect mongodb unit test:', MONGO_DB_LOCAL_URL)
  mongoose.connect(MONGO_DB_LOCAL_URL ?? '', {})
}

export const endUnitTest = () => {
  afterAll(() => {
    mongoose.connection.close()
  })
}
