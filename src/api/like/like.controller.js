const { ObjectId } = require('mongodb')

const { db } = require('../../helpers/db')

const { checkUserDoesExist } = require('../../lib/users')

const {
  checkUserIsAlreadyLiked,
  checkUserIsAlreadyMatched
} = require('./like.lib')

const { validateSendLikeController } = require('./like.schema')

async function sendLikeController(ctx) {
  const {
    auth: { userId },
    params
  } = ctx

  validateSendLikeController(params)

  const userLikedId = ObjectId.createFromHexString(params.user_id)

  await checkUserDoesExist({ _id: userLikedId })

  await checkUserIsAlreadyLiked(userId, userLikedId)

  await checkUserIsAlreadyMatched(userId, userLikedId)

  const mutualLike = await db
    .users()
    .findOne({ _id: userLikedId, like: userId })

  const finalPromise = []

  if (mutualLike) {
    finalPromise.push(
      db.matchs().insertOne({ user_id_1: userId, user_id_2: userLikedId })
    )
    finalPromise.push(
      db.users().updateOne({ _id: userLikedId }, { $pull: { like: userId } })
    )
  } else {
    finalPromise.push(
      db
        .users()
        .updateOne(
          { _id: userId },
          { $push: { like: { $each: [userLikedId], $position: 0 } } }
        )
    )
  }

  await Promise.all(finalPromise)

  ctx.body = {}
}

module.exports = { sendLikeController }
