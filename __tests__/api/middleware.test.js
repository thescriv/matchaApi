const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../testUniverse')

const { db } = require('../../src/helpers/db')
const { createJwtToken } = require('../../src/helpers/jwt')
const { ObjectId } = require('mongodb')

const { authMiddleware } = require('../../src/middleware/authMiddleware')

let deleteDatabase
let universe
let seedDatabase

describe('Middleware API', () => {
  beforeAll(async () => {
    universe = new createTestUniverse()

    deleteDatabase = universe.deleteDatabase
    seedDatabase = universe.seedDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3003)

    client = new apiClient(3003)
  })

  beforeEach(async () => {
    await universe.mockUniverse()
  })

  afterEach(async () => {
    jest.restoreAllMocks()

    await deleteDatabase()
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('Auth', () => {
    let userToken
    let userId
    let nextMockedFn
    let ctxMockedFn

    beforeEach(async () => {
      await seedDatabase(['users'])

      const user = await db.users().findOne()

      userId = user._id

      userToken = createJwtToken(userId.toHexString(), user.secret_key)

      nextMockedFn = jest
        .fn()
        .mockImplementation(() => new Promise((resolve) => resolve()))

      ctxMockedFn = {
        headers: {
          authorization: 'Bearer ' + userToken
        }
      }
    })

    test('do pass auth', async () => {
      await authMiddleware(ctxMockedFn, nextMockedFn)

      expect(userId.equals(new ObjectId(ctxMockedFn.auth.userId))).toBe(true)
    })

    test('do pass auth (no token send)', async () => {
      ctxMockedFn = {
        headers: {}
      }

      await authMiddleware(ctxMockedFn, nextMockedFn)

      expect(ctxMockedFn.auth.userId).toBe(null)
    })

    test('do not pass auth (user does not exist)', async () => {
      await db.users().deleteMany()

      let error

      try {
        await authMiddleware(ctxMockedFn, nextMockedFn)
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('token is invalid')
    })

    test('do not pass auth token signature is invalid', async () => {
      await db.users().updateMany({}, { $set: { secret_key: 'foobar' } })

      try {
        await authMiddleware(ctxMockedFn, nextMockedFn)
      } catch (err) {
        error = err
      }

      expect(error.message).toBe('token is invalid')
    })
  })
})
