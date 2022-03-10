const createError = require('http-errors')

const { db } = require('../helpers/db')

async function checkUserDoesExist(filter) {
  const userExist = await db.users().countDocuments(filter)

  if (!userExist) {
    throw createError(403, 'user.does_not_exist')
  }
}

async function findUserAndAssertExist(filter = {}, options = {}) {
  const user = await db.users().findOne(filter, options)

  if (!user) {
    throw createError(404, 'user.does_not_exist')
  }

  return user
}

module.exports = { checkUserDoesExist, findUserAndAssertExist }
