const Router = require('@koa/router')

const { postRegisterController } = require('./register.controller')

const router = new Router()

router.post('/register', postRegisterController)

module.exports = router.routes()
