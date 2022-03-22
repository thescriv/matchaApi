const { hashString } = require('../../helpers/hash')
const { db } = require('../../helpers/db')

const { logger } = require('../../helpers/logger')

const log = logger.child({ func: 'startApi' })

async function postRegisterUser(bodyUser) {
  const emailAlreadyExist = await db
    .users()
    .countDocuments({ email: bodyUser.email })

  if (emailAlreadyExist) {
    log.info('email already used')

    return
  }

  const newUser = createNewUser(bodyUser)

  await db.users().insertOne(newUser)
}

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

module.exports = { createNewUser, postRegisterUser }
