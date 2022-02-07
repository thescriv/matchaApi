const Router = require('@koa/router')

const { getMeController, updateMeController } = require('./user.controller')

const router = new Router()

router.get('/user', getMeController)

router.post('/user', updateMeController)

module.exports = router.routes()
