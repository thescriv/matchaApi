const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../utils')

const { db } = require('../../src/helpers/db')

let client
let testCatchError
let deleteDatabase

describe('Login API', () => {
  beforeAll(async () => {
    await startApi(3001)

    client = new apiClient(3001)
  })

  beforeEach(() => {
    const universe = createTestUniverse()

    testCatchError = universe.testCatchError
    deleteDatabase = universe.deleteDatabase
  })

  afterEach(async () => {
    jest.restoreAllMocks()

    await deleteDatabase()
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('POST /login', () => {
    test('do login', async () => {
      await db
        .users()
        .insertOne({ email: 'test@test.com', password: 'aaaaaaaa' })

      const { body, status } = await client.postLogin({
        email: 'test@test.com',
        password: 'aaaaaaaa'
      })
      expect({ body, status }).toMatchSnapshot()
    })
  })
})
