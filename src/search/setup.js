const {promisify} = require('util')
const glob = promisify(require('glob'))
const {fs} = require('mz')
const {indexExists, createIndex, indexDocument, deleteDocuments, deleteIndex} = require('./elasticsearch')

function cleanText (text) {
  return text
    .replace(/<style type=.+>(.|\n)*?<\/style>/ig, '')
    .replace(/(<([^>]+)>|\r\n|\n|\r|\&nbsp;|\undefined)/ig, '')
    .trim()
}

function init (client) {
  return indexExists(client)
    .then(exists => exists ? destroy(client) : createIndex(client))
    .catch(console.error)
}

function destroy (client) {
  return deleteIndex(client)
    .then(deleteDocuments(client))
    .catch(error => error)
}

function getFileList (path) {
  return glob(`${path}/**/*.html`)
}

async function readFiles (files) {
  const formattedFiles = []

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const cleanedContent = cleanText(content)

    formattedFiles.push({
      content: cleanedContent,
      fileName: file
    })
  }

  return formattedFiles
}

function indexDocuments (client, documents) {
  return documents.reduce((accumulator, document, index) => {
    return accumulator.then(() => indexDocument(client, document, index))
  }, Promise.resolve())
}

function setup (client, path) {
  return init(client)
    .then(() => getFileList(path))
    .then(files => {
      console.log(`${files.length} files to be formatted.`)
      return readFiles(files)
    })
    .then(files => {
      console.log(`${files.length} to be indexed.`)
      return indexDocuments(client, files)
    })
    .catch(error => error)
}

module.exports = setup
