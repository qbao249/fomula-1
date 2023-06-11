import { Race } from '../models/Race'
import { Team } from '../models/Team'
import { Driver } from '../models/Driver'
import { PipelineStage } from 'mongoose'

/**
 * @requires
 * - search all races ->
 * - group by grandPrix, choose the best driver ->
 * - sort by position
 */
export const searchRace = async (filters: { year: number; grandPrix?: string }) => {
  const { year, grandPrix } = filters ?? {}
  const fromMs = new Date(`${year}-01-01`).getTime()
  const toMs = new Date(`${year}-12-31`).getTime()
  const stage_1: PipelineStage = {
    $match: { date: { $gte: fromMs, $lte: toMs } },
  }
  const stage_2: PipelineStage = {
    $project: { records: 0 },
  }
  const results = await Race.aggregate([stage_1, stage_2])
  console.log('results:', results)
}
