import { Race } from '../models/Race'
import { Team } from '../models/Team'
import { Driver } from '../models/Driver'
import { PipelineStage } from 'mongoose'
import { and, or } from '../utils/mongodb-utils'

const fromMs = (year: number) => new Date(`${year}-01-01`).getTime()
const toMs = (year: number) => new Date(`${year}-12-31`).getTime()

export const searchRace = async (filters: { year: number | number[]; grandPrix?: string | string[] }) => {
  const { year, grandPrix } = filters ?? {}

  if ((typeof year === 'number' && year < 1950) || (Array.isArray(year) && !year.length)) {
    return []
  }

  const matchYear =
    Array.isArray(year) && year.length
      ? or(...year.map((_y) => ({ date: { $gte: fromMs(_y), $lte: toMs(_y) } })))
      : typeof year === 'number'
      ? { date: { $gte: fromMs(year), $lte: toMs(year) } }
      : null
  const matchGrandPrix =
    Array.isArray(grandPrix) && grandPrix.length
      ? or(...grandPrix.map((_g) => ({ grandPrix: _g })))
      : grandPrix
      ? { grandPrix }
      : null

  const stage_1: PipelineStage = {
    $match: and(matchYear, matchGrandPrix),
  }

  console.log('stage_1:', JSON.stringify(stage_1))

  const stage_2: PipelineStage = {
    $project: { records: 0 },
  }
  const results = await Race.aggregate([stage_1, stage_2])
  console.log('results:', results.length)
  return results
}
