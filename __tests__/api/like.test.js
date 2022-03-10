const { ObjectId } = require('mongodb')

const { startApi } = require('../../src/api')
const { createNewUser } = require('../../src/api/register/register.lib')

const { db } = require('../../src/helpers/db')
const { decodeJwtToken } = require('../../src/helpers/jwt')

const { ApiClient } = require('../ApiClient')
const { testCatchError } = require('../jest.utils')

let client

describe('Like API', () => {
  let user
  let userLikedId

  beforeAll(async () => {
    await startApi(3005)

    client = new ApiClient(3005)
  })

  beforeEach(async () => {
    const userPayload = {
      email: 'test@test.com',
      password: 'aaaaaaaa'
    }

    await client.postRegister(userPayload)

    const {
      body: { token: bodyToken }
    } = await client.postLogin(userPayload)

    client.useToken(bodyToken)

    const decodedToken = decodeJwtToken(bodyToken)

    const userId = ObjectId.createFromHexString(decodedToken.user_id)

    const likedUser = await createNewUser({
      email: 'test@test1.com',
      password: 'aaaaaaaa'
    })

    const [{ insertedId }, principalUser] = await Promise.all([
      db.users().insertOne(likedUser),
      db.users().findOne({ _id: userId })
    ])

    userLikedId = insertedId
    user = principalUser
  })

  describe('/like/:user_id', () => {
    test('do like user', async () => {
      const { status } = await client.postLike(userLikedId)

      expect(status).toBe(204)

      const userAfterUpdate = await db.users().findOne({ _id: user._id })
      expect(userAfterUpdate.like).toBeTruthy()
      expect(userAfterUpdate.like.length).toBe(1)
      expect(userLikedId.equals(userAfterUpdate.like[0])).toBe(true)
    })

    test('do like user (Create a match)', async () => {
      await db
        .users()
        .updateOne({ _id: userLikedId }, { $push: { like: user._id } })

      const { status } = await client.postLike(userLikedId)

      expect(status).toBe(204)

      const userAfterUpdate = await db.users().findOne({ _id: user._id })
      expect(userAfterUpdate.like).toBeTruthy()
      expect(userAfterUpdate.like.length).toBe(0)

      const userMatch = await db
        .matchs()
        .findOne({ user_id_1: user._id, user_id_2: userLikedId })
      expect(!!userMatch).toBe(true)
    })

    test('do not like user (user does not exist)', async () => {
      const { body, status } = await testCatchError(() =>
        client.postLike('000000000000000000000000')
      )

      expect(body.message).toBe('user.does_not_exist')
      expect(status).toBe(403)
    })

    test('do not like user (user already liked)', async () => {
      await db
        .users()
        .updateOne({ _id: user._id }, { $set: { like: [userLikedId] } })

      const { body, status } = await testCatchError(() =>
        client.postLike(userLikedId)
      )

      expect(body.message).toBe('user.already_liked')
      expect(status).toBe(409)
    })

    test('do not like user (user already matched)', async () => {
      await db
        .matchs()
        .insertOne({ user_id_1: userLikedId, user_id_2: user._id })

      const { body, status } = await testCatchError(() =>
        client.postLike(userLikedId)
      )

      expect(body.message).toBe('user.already_matched')
      expect(status).toBe(409)
    })
  })
})
