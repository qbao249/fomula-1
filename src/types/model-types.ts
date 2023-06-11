export interface IRecord {
  driverName: string
  teamName: string
  position: number
  no: number
  laps: number
  result: string
  points: number
}

export interface IRace {
  /**
   * key of this race
   */
  id: string
  grandPrix: string
  date?: number
  // records?: { [teamName: string]: { [driverName: string]: IRecord } }
  records?: IRecord[]
}

export interface ITeam {
  /**
   * key of this team
   */
  name: string
}

export interface IDriver {
  /**
   * key of this driver
   */
  name: string
  /**
   * foreign key of a team
   */
  teamName?: string
  nationality?: string
}
