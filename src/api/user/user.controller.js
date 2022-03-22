const { db } = require('../../helpers/db')
const { validateUpdateMeController } = require('./user.schema')

const { updateUser } = require('./user.lib')

async function getMeController(ctx) {
  const {
    auth: { userId }
  } = ctx

  const user = await db.users().findOne({ _id: userId }, { password: 0 })

  ctx.body = user
}

async function updateMeController(ctx) {
  const {
    auth: { userId },
    request: { body }
  } = ctx

  validateUpdateMeController(body)

  await updateUser(userId, body)

  ctx.body = {}
}

module.exports = { getMeController, updateMeController }
