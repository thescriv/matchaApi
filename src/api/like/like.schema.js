const { createValidator } = require('../../helpers/createValidator')

const validateSendLikeController = createValidator({
  type: 'object',
  properties: {
    user_id: { type: 'string', pattern: '^[a-f\\d]{24}$' }
  }
})

module.exports = { validateSendLikeController }
