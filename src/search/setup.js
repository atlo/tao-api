const { promisify } = require('util')
const glob = promisify(require('glob'))
const { fs } = require('mz')
const stopwords = require('nltk-stopwords')
const cheerio = require('cheerio')
const { indexExists, createIndex, indexDocument, putMapping, deleteDocuments, deleteIndex } = require('./elasticsearch')

const hungarian = stopwords.load('hungarian')

function cleanText (text) {
  const cleanedText = text
    .replace(/(<([^>]+)>|\r\n|\n|\r|\&nbsp;|undefined)/ig, '')
    .replace(/[^\w\sáéöóőüúűőöí]|\s+/ig, ' ')
    .trim()

  return stopwords.remove(cleanedText, hungarian)  
}

function getText (html) {
  $ = cheerio.load(html)

  return $('body').text()
}

function destroy (client) {
  return deleteIndex(client)
    .then(deleteDocuments(client))
    .catch(error => error)
}

function init (client) {
  return indexExists(client)
    .then(exists => exists ? destroy(client) : '')
    .then(() => createIndex(client))
    .then(() => putMapping(client))
    .catch(error => error)
}

function getFileList (path) {
  return glob(`${path}/**/*.html`)
}

async function indexFiles (client, files) {
  try {
    console.log(`${files.length} files to be indexed.`)
    let counter = 0

    for (const fileName of files) {
      console.log(`${counter}/510`)
      const html = await fs.readFile(fileName, 'utf8')
      const content = getText(html)
      const suggest = cleanText(content).split(' ')

      const document = {
        content,
        fileName,
        suggest
      }

      await indexDocument(client, document, counter)

      counter++
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

function setup (client, path) {
  return init(client)
    .then(() => getFileList(path))
    .then(files => indexFiles(client, files))
    .catch(error => error)
}

module.exports = setup
