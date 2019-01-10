require('dotenv').config()
const setup = require('./setup')
const {search} = require('./elasticsearch')

module.exports = {setup, search}
