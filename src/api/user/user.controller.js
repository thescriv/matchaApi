const { db } = require('../../helpers/db')
const { validateUpdateMeController } = require('./user.schema')

const { hashString } = require('../../helpers/hash')

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

  const userUpdater = {
    $set: {
      ...body,
      updated_at: Date.now()
    }
  }

  if (body.password || body.email) {
    userUpdater.$set.secret_key = hashString(body.email, body.password)
  }

  await db.users().updateOne({ _id: userId }, userUpdater)

  ctx.body = {}
}

module.exports = { getMeController, updateMeController }
