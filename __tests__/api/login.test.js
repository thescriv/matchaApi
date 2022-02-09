const { ObjectId } = require('mongodb')

const { startApi } = require('../../src/api')

const { db } = require('../../src/helpers/db')
const { decodeJwtToken } = require('../../src/helpers/jwt')

const { ApiClient } = require('../ApiClient')
const { testCatchError } = require('../jest.utils')

let client

describe('Login API', () => {
  beforeAll(async () => {
    await startApi(3001)

    client = new ApiClient(3001)
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
