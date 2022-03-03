const createError = require('http-errors')
const { ObjectId } = require('mongodb')

const { db } = require('../../helpers/db')

const { validateSendLikeController } = require('./like.schema')

async function sendLikeController(ctx) {
  const {
    auth: { userId },
    params
  } = ctx

  validateSendLikeController(params)

  const userLikedId = ObjectId.createFromHexString(params.user_id)

  const likedUserExist = await db.users().countDocuments({ _id: userLikedId })

  if (!likedUserExist) {
    throw createError(403, 'User does not exist', {
      help: 'User does not exist'
    })
  }

  const alreadyLiked = await db
    .users()
    .findOne({ _id: userId, like: userLikedId })

  if (alreadyLiked) {
    throw createError(409, 'User already liked', { help: 'User already liked' })
  }

  const alreadyMatched = await db.matchs().findOne({
    $or: [
      {
        user_id_1: userLikedId,
        user_id_2: userId
      },
      {
        user_id_1: userId,
        user_id_2: userLikedId
      }
    ]
  })

  if (alreadyMatched) {
    throw createError(409, 'User already matched', {
      help: 'User already matched'
    })
  }

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

  ctx.body = {}
}

module.exports = { sendLikeController }
