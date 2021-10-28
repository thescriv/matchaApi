require('dotenv').config()

const { startApi } = require('./src/api')

async function main() {
  try {
    await startApi()
  } catch (err) {
    console.error({ err })
  }
}

main()
