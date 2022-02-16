const { MongoClient } = require('mongodb')
const config = require('../config')

const { logger } = require('./logger')

const client = new MongoClient(config.MONGO_URL)
const log = logger.child({ func: 'db' })

let dbPromise
let dbName

async function createConnection(databaseName = config.MONGO_DATABASE_NAME) {
  if (dbPromise) {
    return dbPromise
  }

  dbName = databaseName

  log.info('Initalize connection to Database...')
  dbPromise = await client.connect()
  log.info('Connected to Database')

  return dbPromise
}

function closeConnection() {
  log.info('closing connection')
  if (dbPromise) {
    dbPromise.close()

    log.info('Connection Closed.')
  } else {
    log.info('connection already Closed.')
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
