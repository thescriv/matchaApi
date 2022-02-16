const { startApi } = require('./src/api')

const { logger } = require('./src/helpers/logger')

const log = logger.child({ func: 'index' })

async function main() {
  try {
    await startApi()
  } catch (err) {
    log.error({ err })
  }
}

main()
