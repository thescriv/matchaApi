const Router = require('@koa/router')

const {
  getHelloWorldController,
  postHelloWorldController
} = require('./helloWorld.controller')

const router = new Router()

router.get('/hello_world/classic_get', getHelloWorldController)

router.post('/hello_world/classic_post', postHelloWorldController)

module.exports = router.routes()
