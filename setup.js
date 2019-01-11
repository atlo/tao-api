require('dotenv').config()
const elasticsearch = require('elasticsearch')
const setup = require('./src/search/setup')

const client = new elasticsearch.Client({
  host: process.env.HOST,
  log: process.env.LOG
})

setup(client, process.env.DATA_PATH)
  .then(() => console.log('Setup successfully finished.'))
  .catch(console.error)
