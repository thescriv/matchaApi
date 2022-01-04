const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../testUniverse')

const { db } = require('../../src/helpers/db')
const { decodeJwtToken } = require('../../src/helpers/jwt')
const { ObjectId } = require('mongodb')

let client
let testCatchError
let deleteDatabase
let universe

describe('User API', () => {
  beforeAll(async () => {
    universe = new createTestUniverse()

    testCatchError = universe.testCatchError
    deleteDatabase = universe.deleteDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3002)

    client = new apiClient(3002)
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

  describe('GET /', () => {
    beforeEach(() => {
      userPayload = {
        email: 'test@test.com',
        password: 'aaaaaaaa'
      }
    })

    test('do get me', async () => {
      await client.postRegister(userPayload)

      const {
        body: { token: bodyToken },
        status: status1
      } = await client.postLogin(userPayload)

      client.useToken(bodyToken)

      const { body, status } = await client.getUser()

      const user = await db.users().findOne()

      expect(status1).toBe(200)
      expect(status).toBe(200)

      expect(user._id.equals(new ObjectId(body._id))).toBe(true)
    })
  })
})
