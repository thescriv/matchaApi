const { db } = require('../../helpers/db')

async function getMeController(ctx) {
  const {
    auth: { userId }
  } = ctx

  const user = await db.users().findOne({ _id: userId }, { password: 0 })

  ctx.body = user
}

module.exports = { getMeController }
