const crypto = require('crypto')
const MockDate = require('mockDate')
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

function mockDate() {
  MockDate.set(new Date('2020-02-09T10:30:00.000Z'))
}

function restoreDate() {
  MockDate.reset()
}

async function mockDatabase(askedSeeds) {
  const seedValue = {
    users: [
      {
        email: 'test@test.com',
        password: 'aaaaaaaa',
        secret_key: 'aaaaaaaa',
        created_at: new Date('2020-02-09T10:30:00.000Z')
      }
    ]
  }

  for (const askedSeed of askedSeeds) {
    await db[askedSeed]().insertMany(seedValue[askedSeed])
  }
}

module.exports = {
  mockCrypto,
  mockDate,
  restoreDate,
  mockDatabase
}
