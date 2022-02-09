const { MongoClient } = require('mongodb')
const config = require('../config')

const client = new MongoClient(config.MONGO_URL)

let dbPromise
let dbName

async function createConnection(databaseName = config.MONGO_DATABASE_NAME) {
  if (dbPromise) {
    return dbPromise
  }

  dbName = databaseName

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

function getDbClient() {
  return client.db(dbName)
}

function users() {
  return client.db(dbName).collection('users')
}

module.exports = {
  createConnection,
  closeConnection,
  getDbClient,
  db: { users }
}
