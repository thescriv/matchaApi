const Router = require('@koa/router')

const { postRegisterUserController } = require('./register.controller')

const router = new Router()

router.post('/register', postRegisterUserController)

module.exports = router.routes()
