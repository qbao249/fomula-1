import mongoose from 'mongoose'
import { IDriver } from '../types/model-types'

const Schema = mongoose.Schema

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  nationality: String,
  raceIds: Array<string>,
  teamName: String,
})

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema)
