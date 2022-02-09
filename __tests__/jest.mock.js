const crypto = require('crypto')
const MockDate = require('mockDate')

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

module.exports = {
  mockCrypto,
  mockDate,
  restoreDate
}
