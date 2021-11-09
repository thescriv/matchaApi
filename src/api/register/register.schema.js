const { createValidator } = require('../../helpers/createValidator')

const validateRegisterController = createValidator({
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
})

module.exports = { validateRegisterController }
