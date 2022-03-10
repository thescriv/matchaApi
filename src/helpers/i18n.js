const i18next = require('i18next')
const config = require('../config')

i18next.init({
  lng: 'fr',
  debug: false,
  resources: {
    fr: {
      translation: {
        ...require('../../locales/fr')
      }
    }
  }
})

function translate(input) {
  if (config.ENABLE_I18N_TRANSLATION) {
    return i18next.t(input)
  }

  return input
}

module.exports = {
  translate
}
