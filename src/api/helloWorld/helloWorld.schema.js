const { createValidator } = require('../../helpers/createValidator')

const validateHelloWorldBody = createValidator({
  type: 'object',
  properties: {
    name: { type: 'string' }
  }
})

module.exports = { validateHelloWorldBody }
