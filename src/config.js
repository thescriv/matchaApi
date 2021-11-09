module.exports = {
  API_URL: process.env.API_URL || 'localhost',
  API_PORT: process.env.API_PORT || '3000',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://root:password@localhost:27017',
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME || 'test'
}
