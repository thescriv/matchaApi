const Router = require('@koa/router')

const {
  classicErrorOnPurpose,
  httpErrorOnPurpose
} = require('./errorOnPurpose.controller')

const router = new Router()

router.get('/error/classic', classicErrorOnPurpose)

router.get('/error/http', httpErrorOnPurpose)

module.exports = router.routes()
