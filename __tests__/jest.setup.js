const nock = require('nock')

const config = require('../src/config')
const { createConnection, getDbClient } = require('../src/helpers/db')

const { stopApi } = require('../src/api')

const { restoreDate, mockCrypto, mockDate } = require('./jest.mock')
const { cleanDatabase } = require('./jest.utils')

beforeAll(async () => {
  nock.disableNetConnect()
  nock.enableNetConnect('localhost')

  await createConnection(`test-${config.JEST_WORKER_ID}`)
})

beforeEach(() => {
  restoreDate()

  mockCrypto()
  mockDate()
})

afterEach(async () => {
  await cleanDatabase()

  nock.cleanAll()
})

afterAll(async () => {
  nock.enableNetConnect()

  await getDbClient().dropDatabase()

  await stopApi()
})
