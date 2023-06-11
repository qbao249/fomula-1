import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'

import { MONGO_DB_URL, NODE_ENV, PORT } from './env-vars'
import { crawlAllDrivers, crawlAllRaces, crawlRace } from './actions/crawl-actions'
import { searchRace } from './actions/search-actions'

const isProduction = () => NODE_ENV === 'production'

console.log('isProduction:', isProduction())

const app = express()

mongoose.connect(MONGO_DB_URL ?? '', {}, function (err) {
  if (err) return console.log('MONGODB.error: ', err)
  console.log('MongoDB Connection -- Ready state is:', mongoose.connection.readyState)
})

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(helmet())
  .use(compression())

// Crawl routers
app.post('/api/crawl/race', async (req, res) => {
  try {
    const { path } = req?.body ?? {}
    const data = await crawlAllRaces(path)
    res.json({ status: 200, message: 'OK', data })
  } catch (error: any) {
    res.status(error?.status).json(error)
  }
})
app.post('/api/crawl/driver', async (req, res) => {
  try {
    const { path } = req?.body ?? {}
    const data = await crawlAllDrivers(path)
    res.json({ status: 200, message: 'OK', data })
  } catch (error: any) {
    res.status(error?.status).json(error)
  }
})

// Search routers
app.post('/api/race/search', async (req, res) => {
  try {
    const { filters } = req?.body ?? {}
    const data = await searchRace(filters)
    res.json({ status: 200, message: 'OK', data })
  } catch (error: any) {
    res.status(error?.status).json(error)
  }
})

if (isProduction()) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`))
} else {
  const hostname = '127.0.0.1'
  app.listen(PORT, hostname, () => console.log(`Server running at http://${hostname}:${PORT}/`))
}
