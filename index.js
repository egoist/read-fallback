'use strict'
const fs = require('fs')
const pathExists = require('path-exists')

function reduce(arr, handler) {
  const run = index => handler(arr[index]).then(flag => {
    if (flag) {
      return arr[index]
    }

    const next = index + 1
    if (next < arr.length) {
      return run(next)
    }

    return null
  })

  return run(0)
}

function defaultHandler(file, index) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        return reject(err)
      }

      resolve({content, file})
    })
  })
}

module.exports = function (file, options) {
  options = Object.assign({
    extensions: ['']
  }, options)

  let files

  if (Array.isArray(file)) {
    files = file
  } else {
    if (!file || typeof file !== 'string') {
      return Promise.reject(new Error('Expected file to be an array of string!'))
    }

    files = options.extensions.map(ext => `${file}${ext}`)
  }

  return reduce(files, file => {
    return pathExists(file)
  }).then(file => {
    if (!file) {
      return null
    }

    if (options.skipHandler) {
      return {file}
    }

    const index = files.indexOf(file)

    return options.handler ?
      options.handler(file, index) :
      defaultHandler(file, index)
  })
}

module.exports.defaultHandler = defaultHandler
