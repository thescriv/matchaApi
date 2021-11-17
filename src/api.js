const Koa = require('koa')
const dotenv = require('dotenv')

const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const { createConnection, closeConnection } = require('./helpers/db')

const { handleErrorMiddleware } = require('./middleware/handleError')

const registerRouter = require('./api/register/register.index')

const config = require('./config')

let server

async function startApi(port) {
  const app = new Koa()

  dotenv.config()

  await createConnection()

  app.use(bodyParser())
  app.use(cors())

  app.use(handleErrorMiddleware)

  app.use(registerRouter)

  server = app.listen(port || config.API_PORT, () => {
    console.log(`Listening on port ${port || config.API_PORT}`)
  })
}

async function stopApi() {
  await Promise.all([
    new Promise((resolve) => server.close(resolve)),
    closeConnection()
  ])

  console.log('Closing server...')
}

module.exports = { startApi, stopApi }
