const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

let client

describe('Register API', () => {
  beforeAll(async () => {
    await startApi(3000)

    client = new apiClient(3000)
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('POST /register', () => {
    let registerPayload

    beforeEach(() => {
      registerPayload = {
        email: 'test@test.com',
        first_name: 'test',
        last_name: 'test'
      }
    })

    test('do register user', async () => {
      const { body, status } = await client.postRegister(registerPayload)

      expect({ body, status }).toMatchSnapshot()
    })
  })
})
