const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

const { db } = require('../../src/helpers/db')

let client

describe('Register API', () => {
  beforeAll(async () => {
    await startApi(3000)

    client = new apiClient(3000)
  })

  afterEach(async () => {
    await db.users().deleteMany({})
  })

  afterAll(async () => {
    await stopApi()

    jest.restoreAllMocks()
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

      const users = await db
        .users()
        .find({}, { projection: { _id: 0 } })
        .toArray()

      expect({ body, status }).toMatchSnapshot()

      expect(users).toMatchSnapshot()
    })
  })
})
