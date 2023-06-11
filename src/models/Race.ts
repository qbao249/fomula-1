import mongoose from 'mongoose'
import { IRace, IRecord } from '../types/model-types'

const Schema = mongoose.Schema

const RaceSchema = new Schema<IRace>({
  id: { type: String, required: true },
  grandPrix: { type: String, required: true },
  date: Number,
  records: Array<IRecord>,
  driverNames: Array<string>,
  teamNames: Array<string>,
})

export const Race = mongoose.model<IRace>('Race', RaceSchema)
