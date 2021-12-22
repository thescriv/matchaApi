const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../utils')

const { db } = require('../../src/helpers/db')

let client
let testCatchError
let deleteDatabase
let universe

describe('Login API', () => {
  beforeAll(async () => {
    universe = new createTestUniverse()

    testCatchError = universe.testCatchError
    deleteDatabase = universe.deleteDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3001)

    client = new apiClient(3001)
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
    let loginPayload

    beforeEach(() => {
      loginPayload = {
        email: 'test@test.com',
        password: 'aaaaaaaa'
      }
    })

    test('do login', async () => {
      await db
        .users()
        .insertOne({ email: 'test@test.com', password: 'aaaaaaaa' })

      const { body, status } = await client.postLogin(loginPayload)
      expect({ body, status }).toMatchSnapshot()
    })

    test('do not login (email or password is bad)', async () => {
      await db.users().deleteMany({})

      const { body, status } = await testCatchError(() =>
        client.postLogin(loginPayload)
      )

      expect({ body, status }).toMatchSnapshot()
    })
  })
})
