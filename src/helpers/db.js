const { MongoClient } = require('mongodb')
const config = require('../config')

const client = new MongoClient(config.MONGO_URL)

let dbPromise

async function createConnection() {
  if (dbPromise) {
    return dbPromise
  }

  console.log('Initalize connection to Database...')
  dbPromise = await client.connect()
  console.log('Connected to Database')

  return dbPromise
}

function closeConnection() {
  console.log('closing connection')
  if (dbPromise) {
    dbPromise.close()

    console.log('Connection Closed.')
  } else {
    console.log('connection already Closed.')
  }
}

function users() {
  return client.db(config.MONGO_DATABASE_NAME).collection('users')
}

module.exports = { createConnection, closeConnection, db: { users } }
