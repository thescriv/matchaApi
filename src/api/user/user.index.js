const Router = require('@koa/router')

const { getMeController } = require('./user.controller')

const router = new Router()

router.get('/user', getMeController)

module.exports = router.routes()
