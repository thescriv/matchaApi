const { createValidator } = require('../../helpers/createValidator')

const validatePostLoginController = createValidator({
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
})

module.exports = { validatePostLoginController }
