const createError = require('http-errors')

const { db } = require('../../helpers/db')

async function checkUserIsAlreadyLiked(userId, userLikedId) {
  const alreadyLiked = await db
    .users()
    .countDocuments({ _id: userId, like: userLikedId })

  if (alreadyLiked) {
    throw createError(409, 'user.already_liked')
  }
}

async function checkUserIsAlreadyMatched(firstUserId, secondUserId) {
  const alreadyMatched = await db.matchs().findOne({
    $or: [
      {
        user_id_1: firstUserId,
        user_id_2: secondUserId
      },
      {
        user_id_1: secondUserId,
        user_id_2: firstUserId
      }
    ]
  })

  if (alreadyMatched) {
    throw createError(409, 'user.already_matched')
  }
}

module.exports = { checkUserIsAlreadyLiked, checkUserIsAlreadyMatched }
