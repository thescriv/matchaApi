const { db } = require('../src/helpers/db')

async function cleanDatabase() {
  await db.users().deleteMany({})
  await db.matchs().deleteMany({})
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

module.exports = { cleanDatabase, testCatchError }
