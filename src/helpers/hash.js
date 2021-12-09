const crypto = require('crypto')

function hashString(payload) {
  return crypto.createHash('sha256').update(payload).digest('hex')
}

module.exports = { hashString }
