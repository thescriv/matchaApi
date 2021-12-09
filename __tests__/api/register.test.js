const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { createTestUniverse } = require('../utils')

const { db } = require('../../src/helpers/db')

let client
let testCatchError

describe('Register API', () => {
  beforeAll(async () => {
    await startApi(3000)

    client = new apiClient(3000)
  })

  beforeEach(() => {
    const universe = createTestUniverse()

    testCatchError = universe.testCatchError
  })

  afterEach(async () => {
    jest.restoreAllMocks()

    await db.users().deleteMany({})
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
      const { body, status } = await client.postRegister(registerPayload)

      const user = await db.users().findOne({}, { projection: { _id: 0 } })

      expect(user.email).toBe('test@test.com')
      expect(user.password).toBe('aaaaaaaa')
      expect(user.secret_key).toBe('aaaaaaaa')

      expect({ body, status }).toMatchSnapshot()
    })

    test('do not register user (email already exist)', async () => {
      await db
        .users()
        .insertOne({ email: 'test@test.com', password: 'aaaaaaaa' })

      const { body, status } = await testCatchError(() =>
        client.postRegister(registerPayload)
      )

      expect({ body, status }).toMatchSnapshot()
    })

    test('do not register user (validationFail)', async () => {
      registerPayload = {
        email: 1234,
        password: true
      }

      const { body, status } = await testCatchError(() =>
        client.postRegister(registerPayload)
      )

      expect({ body, status }).toMatchSnapshot()
    })
  })
})
