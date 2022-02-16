const Koa = require('koa')
const dotenv = require('dotenv')

const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const { createConnection, closeConnection } = require('./helpers/db')
const { logger } = require('./helpers/logger')

const { globalMiddleware } = require('./middleware/globalMiddleware')
const { handleErrorMiddleware } = require('./middleware/handleError')
const { authMiddleware } = require('./middleware/authMiddleware')

const registerRouter = require('./api/register/register.index')
const loginRouter = require('./api/login/login.index')
const userRouter = require('./api/user/user.index')

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
  app.use(handleErrorMiddleware)
  app.use(authMiddleware)

  app.use(registerRouter)
  app.use(loginRouter)
  app.use(userRouter)

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
