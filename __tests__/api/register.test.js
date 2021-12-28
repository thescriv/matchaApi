const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../utils')

const { db } = require('../../src/helpers/db')

let client
let testCatchError
let deleteDatabase
let universe

describe('Register API', () => {
  beforeAll(async () => {
    universe = new createTestUniverse()

    testCatchError = universe.testCatchError
    deleteDatabase = universe.deleteDatabase

    await universe.connectToDatabaseWorker()

    await startApi(3000)

    client = new apiClient(3000)
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

  describe('POST /register', () => {
    let registerPayload

    beforeEach(() => {
      registerPayload = {
        email: 'test@test.com',
        password: 'TestPassword'
      }
    })

    test('do register user', async () => {
      const { status } = await client.postRegister(registerPayload)

      const user = await db.users().findOne({}, { projection: { _id: 0 } })

      expect(user.email).toBe('test@test.com')
      expect(user.password).toBe('aaaaaaaa')
      expect(user.secret_key).toBe('aaaaaaaa')

      expect(status).toBe(204)
    })

    test('do not register user (email already exist)', async () => {
      await db.users().insertOne(registerPayload)

      const { body, status } = await testCatchError(() =>
        client.postRegister(registerPayload)
      )

      expect(body.message).toBe('Email already taken')
      expect(status).toBe(400)
    })

    test('do not register user (validationFail)', async () => {
      registerPayload = {
        email: 1234,
        password: true
      }

      const { body, status } = await testCatchError(() =>
        client.postRegister(registerPayload)
      )

      expect(body.message).toBe('email should be string')
      expect(status).toBe(400)
    })
  })
})
