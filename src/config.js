module.exports = {
  API_PORT: process.env.API_PORT || '3000',
  API_URL: process.env.API_URL || 'localhost',
  JEST_WORKER_ID: process.env.JEST_WORKER_ID,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'foobar',
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'trace',
  MIDDLEWARE_ERROR_LOGGER: true, // process.env.MIDDLEWARE_ERROR_LOGGER === true,
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME || 'test',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  NODE_ENV: process.env.NODE_ENV || 'local'
}
