const { createValidator } = require('../../helpers/createValidator')

const validateUpdateMeController = createValidator({
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['first_name', 'last_name']
})

module.exports = { validateUpdateMeController }
