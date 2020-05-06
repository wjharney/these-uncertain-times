module.exports = {
  env: {
    browser: true,
    es6: true,
    node: false
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {}
}
