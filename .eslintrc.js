module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'no-new': 0,
    'space-before-function-paren': 0
  }
}
