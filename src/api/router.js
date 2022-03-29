const Router = require('@koa/router')

const likeRouter = require('./like/like.index')
const loginRouter = require('./login/login.index')
const registerRouter = require('./register/register.index')
const userRouter = require('./user/user.index')

const router = new Router()

router.use(likeRouter)
router.use(loginRouter)
router.use(registerRouter)
router.use(userRouter)

module.exports = router.routes()
