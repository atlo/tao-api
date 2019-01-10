require('dotenv').config()
const express = require('express')
const elasticsearch = require('elasticsearch')
const cors = require('cors')
const {setup, search} = require('./src/search')

const app = express()
const client = new elasticsearch.Client({
  host: process.env.HOST,
  log: process.env.LOG
})

app.use(cors())

app.get('/search/:query', function (req, res) {
  console.log({query: req.params.query})
  search(client, req.params.query)
    .then(results => {
      const formattedResults = results.hits.hits.map(hit => {
        return {
          fileName: hit._source.fileName,
          highlights: hit.highlight.content
        }
      })

      res.status(200).json({results: formattedResults})
    })
    .catch(error => res.status(500).json({error: error.message}))
})

app.get('*', function (req, res) {
  res.status(404).json({error: 'Resource not found'})
})

app.listen(process.env.PORT, () => console.log('Server is up and running'))
