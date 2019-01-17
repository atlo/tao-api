require('dotenv').config()
const express = require('express')
const elasticsearch = require('elasticsearch')
const cors = require('cors')
const {prop} = require('ramda')
const { search } = require('./src/search')

const app = express()
const client = new elasticsearch.Client({
  host: process.env.HOST,
  log: process.env.LOG
})
const port = process.env.PORT

app.use(cors())

app.use(function (error, req, res, next) {
  console.error(error.stack)
  res.status(500).send({error: error.message})
})

app.get('/search', function (req, res) {
  const { query, page } = req.query
  const from = (page - 1) * 10
  const resultObject = {
    total: 0,
    files: []
  }

  search(client, query, from)
    .then(results => {
      const hits = prop('hits', prop('hits', results))

      if (hits) {
        resultObject.files = hits.map(hit => {
          return {
            fileName: hit._source.fileName,
            highlights: hit.highlight.content
          }
        })
  
        resultObject.total = results.hits.total
      }

      res.status(200).json(resultObject)
    })
    .catch(error => res.status(500).json({ error: error.message }))
})

app.get('*', function (req, res) {
  res.status(404).json({ error: 'Resource not found' })
})

app.listen(port, () => console.log(`Server is up and running ${port}`))
