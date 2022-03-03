const pino = require('pino')

const config = require('../config')

const pinoOption = {
  sync: true,
  level: config.LOGGER_LEVEL,
  transport: {
    target: config.NODE_ENV === 'test' ? 'pino-pretty' : 'stdin'
  }
}

const logger = pino(pinoOption)

module.exports = { logger }
