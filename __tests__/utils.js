const crypto = require('crypto')

function createTestUniverse() {
  jest.mock(crypto, 'update').mockImplementation(() => {
    return 'aaaaaaaa'
  })
}

module.exports = { createTestUniverse }
