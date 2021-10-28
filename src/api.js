const Koa = require('koa')
const dotenv = require('dotenv')

const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const { handleErrorMiddleware } = require('./middleware/handleError')

const helloWorldRouter = require('./api/helloWorld/helloWorld.index')
const errorOnPurposeRouter = require('./api/errorOnPurpose/errorOnPurpose.index')

const config = require('./config')

let server

async function startApi(port) {
  const app = new Koa()

  dotenv.config()

  app.use(bodyParser())
  app.use(cors())

  app.use(handleErrorMiddleware)

  app.use(helloWorldRouter)
  app.use(errorOnPurposeRouter)

  server = app.listen(port || config.API_PORT, () => {
    console.log(`Listening on port ${port || config.API_PORT}`)
  })
}

async function stopApi() {
  await new Promise((resolve) => server.close(resolve))

  console.log('Closing server...')
}

module.exports = { startApi, stopApi }
