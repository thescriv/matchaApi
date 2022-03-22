const { db } = require('../../helpers/db')

const { hashString } = require('../../helpers/hash')

async function updateUser(userId, body) {
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
}

module.exports = { updateUser }
