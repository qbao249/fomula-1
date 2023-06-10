import cheerio from 'cheerio'
import request from 'request-promise'
import { forIn, includes, toNumber } from 'lodash'
import { IDriver, IRace } from '../types/model-types'
import { NODE_ENV } from '../env-vars'
import { FOMULA_1_BASE_URL } from '../constants/baseUrls'
import { Transaction } from '../Transaction'
import { Race } from '../models/Race'
import { Driver } from '../models/Driver'
import { Team } from '../models/Team'

// Race
export const crawlAllRaces = async (path: string) => {
  const baseUrl = FOMULA_1_BASE_URL
  try {
    const url = baseUrl + path
    // console.log('url: ' + url)
    const html = await request(url)
    const $ = cheerio.load(html) //loading of complete HTML body
    const paths: string[] = []
    const crawlRacePromises: any[] = []
    $('.resultsarchive-table tbody tr').each((_rowIndex, _row) => {
      $(_row)
        .find('td')
        .each((_colIndex, _col) => {
          switch (_colIndex) {
            case 1:
              {
                const path = $(_col).find('a').attr('href')
                if (path) {
                  paths.push(path)
                  crawlRacePromises.push(crawlRace(path))
                } else {
                  NODE_ENV === 'development' && console.log('path is not valid at col index:', _colIndex)
                }
              }
              break
          }
        })
    })
    const driverRaceIds: { [driverName: string]: string[] } = {}
    const teamRaceIds: { [teamName: string]: string[] } = {}
    const teamDriverNames: { [teamName: string]: string[] } = {}
    const raceDriverNames: { [raceName: string]: string[] } = {}
    const raceTeamNames: { [raceName: string]: string[] } = {}
    if (paths.length) {
      const results = await Promise.all(crawlRacePromises)
      results.forEach((_r) => {
        const { records, id: raceId } = _r as IRace
        forIn(records, (_team: any, _teamK: string) => {
          forIn(_team, (_driver: any, _driverK) => {
            if (!driverRaceIds[_driverK]) driverRaceIds[_driverK] = []
            driverRaceIds[_driverK].push(raceId)
            if (!teamDriverNames[_teamK]) {
              teamDriverNames[_teamK] = [_driverK]
            } else if (!includes(teamDriverNames[_teamK], _driverK)) {
              teamDriverNames[_teamK].push(_driverK)
            }
            if (!raceDriverNames[raceId]) raceDriverNames[raceId] = []
            raceDriverNames[raceId].push(_driverK)
          })
          if (!teamRaceIds[_teamK]) teamRaceIds[_teamK] = []
          teamRaceIds[_teamK].push(raceId)
          if (!raceTeamNames[raceId]) raceTeamNames[raceId] = []
          raceTeamNames[raceId].push(_teamK)
        })
      })
    }
    console.log('result', { driverRaceIds, teamRaceIds, teamDriverNames, raceDriverNames, raceTeamNames })
  } catch (error) {
    NODE_ENV === 'development' && console.log('crawlAllRaces.error', error)
    return error
  }
}

export const crawlRace = async (path: string) => {
  const url = FOMULA_1_BASE_URL + path
  try {
    let year = 0
    let grandPrix = ''
    let raceId = ''

    if (url) {
      const path = url.split('.html/')[1]
      const parts = path.split('/')
      if (parts.length === 5) {
        year = toNumber(parts[0])
        grandPrix = parts[3]
        raceId = parts[2]
      }
    }
    if (!year) throw { status: 404, message: 'Please select a year' }
    if (!grandPrix) throw { status: 404, message: 'Please select a grandPrix' }
    const html = await request(url)
    const $ = cheerio.load(html) //loading of complete HTML body
    const data: IRace = { id: raceId, grandPrix, dateTime: year }
    $('.resultsarchive-col-right .resultsarchive-table tbody tr').each(function (_rowIndex, _row) {
      // console.log('_rowIndex:', _rowIndex) //index;
      let position = 0
      let no = 0
      let driverName = ''
      let team = ''
      let laps = 0
      let result = ''
      let points = 0
      $(_row)
        .find('td')
        .each((_colIndex, _col) => {
          switch (_colIndex) {
            case 1: // Position
              {
                position = (() => {
                  const nextPosition = toNumber($(_col).text())
                  return isNaN(nextPosition) ? 0 : nextPosition
                })()
              }
              break
            case 2: // NO
              no = toNumber($(_col).text())
              break
            case 3:
              driverName = (() => {
                const [firstName, lastName] = $(_col).find('span')
                return $(firstName).text() + ' ' + $(lastName).text()
              })()
              break
            case 4:
              team = $(_col).text()
              break
            case 5:
              laps = toNumber($(_col).text())
              break
            case 6:
              result = $(_col).text()
              break
            case 7:
              points = toNumber($(_col).text())
              break
          }
        })
      // console.log('crawlWebsite.race-infos', { position, no, driverName, team, laps, result, points })
      if (!data.records) data.records = {}
      if (!data.records[team]) data.records[team] = {}
      data.records[team][driverName] = { driverName, teamName: team, laps, no, points, position, result }
    })

    return data
  } catch (error) {
    console.log('crawlWebsite.error:', error)
    throw error
  }
}

// Driver

export const crawlAllDrivers = async (path: string) => {
  const baseUrl = FOMULA_1_BASE_URL
  try {
    const url = baseUrl + path
    console.log('url: ' + url)
    const html = await request(url)
    const $ = cheerio.load(html) //loading of complete HTML body
    const drivers: IDriver[] = []
    // const crawlDriverPromises: any[] = []
    $('.resultsarchive-table tbody tr').each((_rowIndex, _row) => {
      // console.log('_row: ' + $(_row).text())
      let name = ''
      let nationality = ''
      let path = ''
      $(_row)
        .find('td')
        .each((_colIndex, _col) => {
          switch (_colIndex) {
            case 2:
              path = $(_col).find('a').attr('href') ?? ''
              // crawlDriverPromises.push(crawlDriver(path))
              name = (() => {
                const [firstName, lastName] = $(_col).find('a span')
                return $(firstName).text() + ' ' + $(lastName).text()
              })()
              break
            case 3:
              nationality = $(_col).text()
              break
            // case 2:
            //   break
            // case 3:
            //   break
            // case 4:
            //   break
            // case 5:
            //   break
            // case 6:
            //   break
          }
        })
      drivers.push({ name, nationality })
    })
    // if (crawlDriverPromises.length) {
    //   const results = await Promise.all(crawlDriverPromises)
    //   drivers = drivers.map((_d, _dIndex) => {
    //     return { ..._d, raceIds: results[_dIndex] }
    //   })
    // }
    console.log('drivers: ', drivers)
  } catch (error) {
    NODE_ENV === 'development' && console.log('crawlAllRaces.error', error)
    return error
  }
}

// export const crawlDriver = async (path: string) => {
//   const url = FOMULA_1_BASE_URL + path
//   try {
//     if (!path) throw { status: 404, message: 'Please select a path' }
//     const html = await request(url)
//     const $ = cheerio.load(html) //loading of complete HTML body
//     const raceIds: string[] = []
//     $('.resultsarchive-content .resultsarchive-table tbody tr').each(function (_rowIndex, _row) {
//       // console.log('_rowIndex:', _rowIndex) //index;
//       let raceId = ''
//       $(_row)
//         .find('td')
//         .each((_colIndex, _col) => {
//           switch (_colIndex) {
//             case 1: // Position
//               {
//                 raceId = (() => {
//                   const path = $(_col).find('a').attr('href')
//                   if (path) {
//                     const parts = path.split('/')
//                     if (parts.length > 3) {
//                       return parts[parts.length - 2]
//                     }
//                   }
//                   return ''
//                 })()
//                 if (raceId) raceIds.push(raceId)
//               }
//               break
//           }
//         })
//     })
//     return raceIds
//   } catch (error) {
//     console.log('crawlWebsite.error:', error)
//     throw error
//   }
// }

const saveCrawlFromRaceTransaction = new Transaction()
const saveCrawlFromRace = async () => {
  await saveCrawlFromRaceTransaction.runTransaction('testSessionId', async (currSession) => {
    // TODO: save data
  })
}
