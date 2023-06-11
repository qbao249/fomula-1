import { Race } from '../models/Race'
import { Team } from '../models/Team'
import { Driver } from '../models/Driver'
import { PipelineStage } from 'mongoose'
import { and, or } from '../utils/mongodb-utils'
import { IDriver, IRace, IRecord } from 'types/model-types'
import { includes } from 'lodash'

const fromMs = (year: number) => new Date(`${year}-01-01`).getTime()
const toMs = (year: number) => new Date(`${year}-12-31`).getTime()
const getDriverIndexExpr = <T extends keyof IRecord>(property: T, value: IRecord[T]) => ({
  $indexOfArray: [`$records.${property}`, value],
})

export const searchRace = async (filters: {
  year: number | number[]
  grandPrix?: string | string[]
  driver: string | string[]
  team: string | string[]
}) => {
  const { year, grandPrix, driver, team } = filters ?? {}

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

  const addFieldWinDriverAndTeam = {
    winDriver: {
      $arrayElemAt: ['$records', getDriverIndexExpr('position', 1)],
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

  const addFieldTargetTeams = ''

  const stage_2: PipelineStage = {
    $addFields: { ...addFieldWinDriverAndTeam, ...addFieldTargetDrivers },
  }

  const stage_3: PipelineStage = {
    $project: { records: 0 },
  }

  const results = await Race.aggregate([stage_1])
  const data: any[] = []
  results.forEach((_r: IRace) => {
    const { records, ...rest } = _r
    let el: any = rest
    let winDriver: IRecord | undefined
    let winTeam: { name: string; points: number } | undefined
    const targetDrivers: (typeof winDriver)[] = []
    const targetTeams: (typeof winTeam)[] = []
    const teams: { [k: string]: any } = {}
    records?.forEach((_rec) => {
      if (!teams[_rec.teamName]) teams[_rec.teamName] = { name: _rec.teamName, points: 0 }
      teams[_rec.teamName].points += _rec.points
      if (winDriver?.points ?? 0 < _rec.points) winDriver = _rec
      if (Array.isArray(driver) && includes(driver, _rec.driverName)) targetDrivers.push(_rec)
      else if (driver === _rec.driverName) targetDrivers.push(_rec)
    })
    Object.entries(teams).forEach(([, _t]) => {
      if ((winTeam?.points ?? 0) < _t.points) {
        winTeam = _t
      }
      if (Array.isArray(team) && includes(team, _t.name)) targetTeams.push(_t)
      else if (team === _t.name) targetTeams.push(_t)
    })
    el = { ...el, winDriver, winTeam }
    if (targetDrivers.length) el = { ...el, targetDrivers }
    if (targetTeams.length) el = { ...el, targetTeams }

    data.push(el)
  })
  return data
}

export const searchTeam = async (filters: { year: string; team: string; grandPrix: string }) => {
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

  const stage_2: PipelineStage = {
    $unwind: { path: '$records' },
  }

  const stage_3: PipelineStage = {
    $group: { _id: '$records.teamName', points: { $sum: '$records.points' } },
  }

  const stage_4: PipelineStage = {
    $sort: { points: -1 },
  }

  const data = await Race.aggregate([stage_1, stage_2, stage_3, stage_4])
  return data
}
