function deleteIndex (client) {
  return client.indices.delete({ index: 'tao', ignoreUnavailable: true })
}

function deleteDocuments (client, q = '*') {
  return client.deleteByQuery({ index: 'tao', q, ignoreUnavailable: true })
}

function indexExists (client) {
  return client.indices.exists({ index: 'tao' })
}

function createIndex (client) {
  return client.indices.create({ index: 'tao' })
}

function putMapping (client) {
  return client.indices.putMapping({
    index: 'tao',
    type: 'file',
    body: {
      properties: {
        fileName: {
          type: 'text'
        },
        googleId: {
          type: 'text'
        },
        content: {
          type: 'text'
        }
      }
    }
  })
}

function indexDocument (client, document, index) {
  return client.index({
    index: 'tao',
    type: 'file',
    id: index + 1,
    body: document
  })
}

function search (client, query, from = 0) {
  return client.search({
    index: 'tao',
    body: {
      from,
      query: {
        bool: {
          should: [
            {
              match_phrase: {
                content: query
              }
            },
            {
              fuzzy: {
                content: {
                  value: query,
                  fuzziness: 1,
                  prefix_length: 3
                }
              }
            }
          ]
        }
      },
      highlight: {
        fields: {
          content: {}
        }
      },
      _source: {
        exclude: ['content']
      }
    }
  })
}

module.exports = {
  deleteIndex,
  indexExists,
  createIndex,
  indexDocument,
  deleteDocuments,
  search,
  putMapping
}
