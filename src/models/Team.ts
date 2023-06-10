import mongoose from 'mongoose'
import { ITeam } from '../types/model-types'

const Schema = mongoose.Schema

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  driverNames: Array<string>,
  raceIds: Array<string>,
})

export const Team = mongoose.model<ITeam>('Team', TeamSchema)
