const crypto = require('crypto')
const { db } = require('../src/helpers/db')

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

async function testCatchError(callbackFunction) {
  let error
  try {
    await callbackFunction()
  } catch (err) {
    error = err.response
  }

  return error
}

async function deleteDatabase() {
  await db.users().deleteMany({})
}

function createTestUniverse() {
  mockCrypto()

  return { testCatchError, deleteDatabase }
}

module.exports = { createTestUniverse }
