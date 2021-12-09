const Router = require('@koa/router')

const { postLoginController } = require('./login.controller')

const router = new Router()

router.post('/login', postLoginController)

module.exports = router.routes()
