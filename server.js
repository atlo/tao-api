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
const port = process.env.PORT

app.use(cors())

app.get('/search', function (req, res) {
  const {query, from} = req.query
  const resultObject = {
    total: 0,
    files: []
  }

  search(client, query, from)
    .then(results => {
      resultObject.files = results.hits.hits.map(hit => {
        return {
          fileName: hit._source.fileName,
          highlights: hit.highlight.content
        }
      })

      resultObject.total = results.hits.total
      
      res.status(200).json(resultObject)
    })
    .catch(error => res.status(500).json({error: error.message}))
})

app.get('*', function (req, res) {
  res.status(404).json({error: 'Resource not found'})
})

app.listen(port, () => console.log(`Server is up and running ${port}`))
