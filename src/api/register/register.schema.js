const { createValidator } = require('../../helpers/createValidator')

const validateRegisterController = createValidator({
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['first_name', 'last_name', 'email']
})

module.exports = { validateRegisterController }
