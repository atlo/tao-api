require('dotenv').config()
const setup = require('./setup')
const { search, suggest } = require('./elasticsearch')

module.exports = { setup, search, suggest }
