const { startApi, stopApi } = require('../../src/api')
const { ApiClient } = require('../ApiClient')

const { CreateTestUniverse } = require('../testUniverse')

const { db } = require('../../src/helpers/db')
const { decodeJwtToken } = require('../../src/helpers/jwt')
const { ObjectId } = require('mongodb')

let client
let testCatchError
let deleteDatabase
let universe

describe('Login API', () => {
  beforeAll(async () => {
    universe = new CreateTestUniverse()

    testCatchError = universe.testCatchError
    deleteDatabase = universe.deleteDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3001)

    client = new ApiClient(3001)
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

  describe('POST /login', () => {
    let userPayload

    beforeEach(() => {
      userPayload = {
        email: 'test@test.com',
        password: 'aaaaaaaa'
      }
    })

    test('do login', async () => {
      await client.postRegister(userPayload)

      const { body, status } = await client.postLogin(userPayload)

      const user = await db.users().findOne()

      const tokenPayload = decodeJwtToken(body.token)

      expect(user._id.equals(new ObjectId(tokenPayload.user_id))).toBe(true)
      expect(status).toBe(200)
    })

    test('do not login (email or password is bad)', async () => {
      await db.users().deleteMany({})

      const { body, status } = await testCatchError(() =>
        client.postLogin(userPayload)
      )

      expect(body.message).toBe('user not found')

      expect(status).toBe(404)
    })
  })
})
