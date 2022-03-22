const createError = require('http-errors')

const { db } = require('../../helpers/db')

async function sendLikeOrCreateMatch(userId, userLikedId) {
  const mutualLike = await db
    .users()
    .findOne({ _id: userLikedId, like: userId })

  if (mutualLike) {
    await Promise.all([
      db.matchs().insertOne({ user_id_1: userId, user_id_2: userLikedId }),
      db.users().updateOne({ _id: userLikedId }, { $pull: { like: userId } })
    ])
  } else {
    await db
      .users()
      .updateOne(
        { _id: userId },
        { $push: { like: { $each: [userLikedId], $position: 0 } } }
      )
  }
}

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

module.exports = {
  checkUserIsAlreadyLiked,
  checkUserIsAlreadyMatched,
  sendLikeOrCreateMatch
}
