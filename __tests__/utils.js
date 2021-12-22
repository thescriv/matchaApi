const crypto = require('crypto')
const MockDate = require('mockDate')

const config = require('../src/config')
const { createConnection, db } = require('../src/helpers/db')

function mockCrypto() {
  jest.spyOn(crypto, 'createHash').mockImplementation(() => {
    return {
      update: () => {
        return {
          digest: () => {
            return 'aaaaaaaa'
          }
        }
      }
    }
  })
}

function mockDate() {
  MockDate.set(new Date('2020-02-09T10:30:00.000Z'))
}

function restoreDate() {
  MockDate.reset()
}

class createTestUniverse {
  constructor() {}

  mockUniverse() {
    restoreDate()

    mockCrypto()
    mockDate()
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
