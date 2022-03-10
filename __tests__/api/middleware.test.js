const { ObjectId } = require('mongodb')

const { db } = require('../../src/helpers/db')
const { createJwtToken } = require('../../src/helpers/jwt')

const { authMiddleware } = require('../../src/middleware/authMiddleware')

const { seedDatabase } = require('../jest.seed')

describe('Middleware API', () => {
  describe('Auth', () => {
    let userToken
    let userId
    let nextMockedFn
    let ctxMocked

    beforeEach(async () => {
      await seedDatabase(['users'])

      const user = await db.users().findOne()

      userId = user._id

      userToken = createJwtToken(userId.toHexString(), user.secret_key)

      nextMockedFn = jest
        .fn()
        .mockImplementation(() => new Promise((resolve) => resolve()))

      ctxMocked = {
        headers: {
          authorization: 'Bearer ' + userToken
        }
      }
    })

    test('do pass auth', async () => {
      await authMiddleware(ctxMocked, nextMockedFn)

      expect(userId.equals(new ObjectId(ctxMocked.auth.userId))).toBe(true)
    })

    test('do pass auth (no token send)', async () => {
      ctxMocked = {
        headers: {}
      }

      await authMiddleware(ctxMocked, nextMockedFn)

      expect(ctxMocked.auth.userId).toBe(null)
    })

    test('do not pass auth (user does not exist)', async () => {
      await db.users().deleteMany()

      let error

      try {
        await authMiddleware(ctxMocked, nextMockedFn)
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('token.invalid')
    })

    test('do not pass auth token signature is invalid', async () => {
      await db.users().updateMany({}, { $set: { secret_key: 'foobar' } })

      let error

      try {
        await authMiddleware(ctxMocked, nextMockedFn)
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('token.invalid')
    })
  })
})
