const { startApi, stopApi } = require('../../src/api')
const { ApiClient } = require('../ApiClient')

const { CreateTestUniverse } = require('../testUniverse')

const { db } = require('../../src/helpers/db')
// const { decodeJwtToken } = require('../../src/helpers/jwt')
const { ObjectId } = require('mongodb')

let client
let deleteDatabase
let universe

describe('User API', () => {
  beforeAll(async () => {
    universe = new CreateTestUniverse()

    deleteDatabase = universe.deleteDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3004)

    client = new ApiClient(3004)
  })

  beforeEach(async () => {
    await universe.mockUniverse()

    const userPayload = {
      email: 'test@test.com',
      password: 'aaaaaaaa'
    }

    await client.postRegister(userPayload)

    const {
      body: { token: bodyToken }
    } = await client.postLogin(userPayload)

    client.useToken(bodyToken)
  })

  afterEach(async () => {
    jest.restoreAllMocks()

    await deleteDatabase()
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('GET /', () => {
    test('do get me', async () => {
      const { body, status } = await client.getUser()

      const user = await db.users().findOne()

      expect(status).toBe(200)

      expect(user._id.equals(new ObjectId(body._id))).toBe(true)
    })
  })

  describe('POST /', () => {
    test('do update my profile', async () => {
      const updaterUserPayload = {
        first_name: 'John',
        last_name: 'Lennon'
      }

      const { status } = await client.postUser(updaterUserPayload)

      const user = await db.users().findOne({})

      console.log(user)

      expect(user.first_name).toBe('John')
      expect(user.last_name).toBe('Lennon')

      expect(status).toBe(204)
    })
  })
})
