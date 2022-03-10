const { db } = require('../../helpers/db')

const { validateRegisterController } = require('./register.schema')

const { createNewUser } = require('./register.lib')

const { logger } = require('../../helpers/logger')

const log = logger.child({ func: 'startApi' })

async function postRegisterController(ctx) {
  const {
    request: { body }
  } = ctx

  validateRegisterController(body)

  const emailAlreadyExist = await db
    .users()
    .countDocuments({ email: body.email })

  if (!emailAlreadyExist) {
    const newUser = createNewUser(body)

    await db.users().insertOne(newUser)
  } else {
    log.info('email already used')
  }

  ctx.body = {}
}

module.exports = { postRegisterController }
