import mongoose from 'mongoose'
import { IRace, IRecord } from '../types/model-types'

const Schema = mongoose.Schema

const RaceSchema = new Schema<IRace>({
  id: { type: String, required: true, unique: true },
  grandPrix: { type: String, required: true, index: true },
  date: Number,
  records: Array<IRecord>,
})

export const Race = mongoose.model<IRace>('Race', RaceSchema)
