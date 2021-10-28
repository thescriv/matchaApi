const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

describe('errorOnPurpose API', () => {
  let client = null

  beforeAll(async () => {
    await startApi(3001)

    client = new apiClient(3001)
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('GET /error/classic', () => {
    test('do get an error', async () => {
      let error

      try {
        await client.classicErrorOnPurpose()
      } catch (err) {
        error = err.response
      }
      const { body, status } = error

      expect({ body, status }).toMatchSnapshot()
    })
  })

  describe('GET /error/http', () => {
    test('do get an error', async () => {
      let error

      try {
        await client.httpErrorOnPurpose()
      } catch (err) {
        error = err.response
      }
      const { body, status } = error

      expect({ body, status }).toMatchSnapshot()
    })
  })
})
