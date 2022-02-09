const { startApi } = require('../../src/api')

const { db } = require('../../src/helpers/db')

const { ApiClient } = require('../ApiClient')
const { testCatchError } = require('../jest.utils')

let client

describe('Register API', () => {
  beforeAll(async () => {
    await startApi(3000)

    client = new ApiClient(3000)
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
