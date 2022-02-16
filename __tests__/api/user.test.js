const { ObjectId } = require('mongodb')

const { startApi } = require('../../src/api')

const { db } = require('../../src/helpers/db')

const { ApiClient } = require('../ApiClient')

let client

describe('User API', () => {
  beforeAll(async () => {
    await startApi(3004)

    client = new ApiClient(3004)
  })

  beforeEach(async () => {
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

      expect(user.first_name).toBe('John')
      expect(user.last_name).toBe('Lennon')

      expect(status).toBe(204)
    })
  })
})
