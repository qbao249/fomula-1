import { Race } from '../models/Race'
import { Team } from '../models/Team'
import { Driver } from '../models/Driver'
import { PipelineStage } from 'mongoose'
import { and, or } from '../utils/mongodb-utils'
import { IDriver, IRecord } from 'types/model-types'

const fromMs = (year: number) => new Date(`${year}-01-01`).getTime()
const toMs = (year: number) => new Date(`${year}-12-31`).getTime()
const getDriverIndexExpr = <T extends keyof IRecord>(property: T, value: IRecord[T]) => ({
  $indexOfArray: [`$records.${property}`, value],
})

const isValidIndex = () => {}

export const searchRace = async (filters: {
  year: number | number[]
  grandPrix?: string | string[]
  driver: string | string[]
}) => {
  const { year, grandPrix, driver } = filters ?? {}

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

  const getWinDriverIndexExpr = { $indexOfArray: ['$records.position', 1] }

  const addFieldWinDriver = {
    winDriver: {
      $arrayElemAt: ['$records', getWinDriverIndexExpr],
    },
  }

  const addFieldTargetDrivers =
    Array.isArray(driver) && driver.length
      ? {
          targetDrivers: driver.flatMap((_d) => {
            return _d ? [{ $arrayElemAt: ['$records', getDriverIndexExpr('driverName', _d)] }] : []
          }),
        }
      : typeof driver === 'string' && driver
      ? {
          targetDrivers: [
            {
              $arrayElemAt: [
                '$records',
                {
                  $cond: {
                    if: { $eq: [getDriverIndexExpr('driverName', driver), -1] },
                    then: { $size: '$records' },
                    else: getDriverIndexExpr('driverName', driver),
                  },
                },
              ],
            },
          ],
        }
      : { targetElemAt: [] }

  const stage_2: PipelineStage = {
    $addFields: { ...addFieldWinDriver, ...addFieldTargetDrivers },
  }

  const stage_3: PipelineStage = {
    $project: { records: 0 },
  }
  const results = await Race.aggregate([stage_1, stage_2, stage_3])
  console.log('results:', results.length)
  return results
}
