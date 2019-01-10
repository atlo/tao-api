function deleteIndex (client) {
  return client.indices.delete({index: 'tao', ignoreUnavailable: true})
}

function deleteDocuments (client, q = '*') {
  return client.deleteByQuery({index: 'tao', q, ignoreUnavailable: true})
}

function indexExists (client) {
  return client.indices.exists({index: 'tao'})
}

function createIndex (client) {
  return client.indices.create({index: 'tao'})
}

function indexDocument (client, body, index) {
  return client.index({
    index: 'tao',
    type: 'file',
    id: index + 1,
    body
  })
}

function search (client, query) {
  return client.search({
    index: 'tao',
    //type: 'file',
    body: {
      /* size: 10,
      from: 0, */
      query: {
        match: {
          content: query
        }
      },
      highlight: {
        fields: {
          content: {}
        }
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
  search
}
