const Router = require('@koa/router')

const { sendLikeController } = require('./like.controller')

const router = new Router()

router.post('/like/:user_id', sendLikeController)

module.exports = router.routes()
