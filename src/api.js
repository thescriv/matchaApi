const Koa = require('koa')
const dotenv = require('dotenv')

const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const { createConnection, closeConnection } = require('./helpers/db')
const { logger } = require('./helpers/logger')

const { globalMiddleware } = require('./middleware/globalMiddleware')
const { errorMiddleware } = require('./middleware/errorMiddleware')
const { authMiddleware } = require('./middleware/authMiddleware')

const router = require('./api/router')

const config = require('./config')

const log = logger.child({ func: 'startApi' })

let server = null

async function startApi(port) {
  const app = new Koa()

  dotenv.config()

  await createConnection()

  app.use(bodyParser())
  app.use(cors())

  app.use(globalMiddleware)
  app.use(errorMiddleware)
  app.use(authMiddleware)

  app.use(router)

  server = app.listen(port || config.API_PORT, () => {
    log.info(`Listening on port ${port || config.API_PORT}`)
  })
}

async function stopApi() {
  await Promise.all([
    new Promise((resolve) => {
      if (server) {
        server.close(resolve)
      }
      resolve()
    }),
    closeConnection()
  ])

  log.info('Closing server...')
}

module.exports = { startApi, stopApi }
