const { hashString } = require('../../helpers/hash')

function createNewUser(registrationInfo) {
  const secretKey = hashString(
    registrationInfo.email + registrationInfo.password
  )

  const userPassword = hashString(registrationInfo.password)

  const newUser = {
    ...registrationInfo,
    password: userPassword,
    secret_key: secretKey,
    created_at: Date.now(),
    updated_at: Date.now(),
    visited_by: [],
    like: [],
    match: []
  }

  return newUser
}

module.exports = { createNewUser }
