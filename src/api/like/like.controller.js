const { ObjectId } = require('mongodb')

const { checkUserDoesExist } = require('../../lib/users')

const {
  checkUserIsAlreadyLiked,
  checkUserIsAlreadyMatched,
  sendLikeOrCreateMatch
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

  await Promise.all([
    checkUserIsAlreadyLiked(userId, userLikedId),
    checkUserIsAlreadyMatched(userId, userLikedId)
  ])

  await sendLikeOrCreateMatch(userId, userLikedId)

  ctx.body = {}
}

module.exports = { sendLikeController }
