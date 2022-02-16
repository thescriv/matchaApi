const pino = require('pino')

const config = require('../config')

const logger = pino({
  sync: true,
  level: config.LOGGER_LEVEL
})

module.exports = { logger }
