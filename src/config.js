module.exports = {
  API_URL: process.env.API_URL || 'localhost',
  API_PORT: process.env.API_PORT || '3000',
  MIDDLEWARE_ERROR_LOGGER: process.env.MIDDLEWARE_ERROR_LOGGER === true,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://root:password@localhost:27017',
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME || 'test1',
  JEST_WORKER_ID: process.env.JEST_WORKER_ID
}
