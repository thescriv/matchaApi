const config = require('../src/config')
const { createConnection, db } = require('../src/helpers/db')

const { mockCrypto, mockDate, restoreDate, mockDatabase } = require('./mocker')

class createTestUniverse {
  constructor() {
    config.MIDDLEWARE_ERROR_LOGGER = true
  }

  mockUniverse() {
    restoreDate()

    mockCrypto()
    mockDate()
  }

  async seedDatabase(askedSeeds) {
    await mockDatabase(askedSeeds)
  }

  async connectToDatabaseWorker() {
    await createConnection(`test-${config.JEST_WORKER_ID}`)
  }

  async testCatchError(callbackFunction) {
    let error
    try {
      await callbackFunction()
    } catch (err) {
      error = err.response
    }

    return error
  }

  async deleteDatabase() {
    await db.users().deleteMany({})
  }
}

module.exports = { createTestUniverse }
