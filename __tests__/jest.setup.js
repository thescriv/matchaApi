const config = require('../src/config')
const { createConnection, getDbClient } = require('../src/helpers/db')

const { stopApi } = require('../src/api')

const { restoreDate, mockCrypto, mockDate } = require('./jest.mock')
const { cleanDatabase } = require('./jest.utils')

beforeAll(async () => {
  await createConnection(`test-${config.JEST_WORKER_ID}`)
})

beforeEach(() => {
  config.MIDDLEWARE_ERROR_LOGGER = false

  restoreDate()

  mockCrypto()
  mockDate()
})

afterEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  await getDbClient().dropDatabase()

  await stopApi()
})
