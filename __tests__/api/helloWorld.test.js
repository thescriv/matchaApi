const { startApi, stopApi } = require('../../src/api')
const { apiClient } = require('../apiClient')

let client

describe('HelloWorld API', () => {
  beforeAll(async () => {
    await startApi(3000)

    client = new apiClient(3000)
  })

  afterAll(async () => {
    await stopApi()
  })

  describe('GET /hello_world/classic_get', () => {
    test('do fetch getHelloWorld', async () => {
      const { body, status } = await client.getHelloWorld()

      expect({ body, status }).toMatchSnapshot()
    })
  })

  describe('POST /hello_world/classic_http', () => {
    test('do fetch postHelloWorld', async () => {
      const { body, status } = await client.postHelloWorld({
        name: 'Koa Setup'
      })

      expect({ body, status }).toMatchSnapshot()
    })
  })
})
