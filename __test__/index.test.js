/* globals describe test expect */
const path = require('path')
const read = require('../')

describe('it works', () => {
  test('in between', () => {
    return read('__test__/fixtures/fixture', {extensions: ['.txt', '.md', '.mark']})
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.content.trim()).toBe('md')
        expect(data.file).toBe('__test__/fixtures/fixture.md')
      })
  })

  test('last', () => {
    return read('__test__/fixtures/fixture', {extensions: ['.txt', '.mark', '.md']})
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.content.trim()).toBe('md')
        expect(data.file).toBe('__test__/fixtures/fixture.md')
      })
  })

  test('first', () => {
    return read('__test__/fixtures/fixture', {extensions: ['.md', '.txt', '.mark']})
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.content.trim()).toBe('md')
        expect(data.file).toBe('__test__/fixtures/fixture.md')
      })
  })

  test('direct use an array of files', () => {
    return read(['.md', '.txt', '.mark'].map(ext => `__test__/fixtures/fixture${ext}`))
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.content.trim()).toBe('md')
        expect(data.file).toBe('__test__/fixtures/fixture.md')
      })
  })

  test('it uses the first met file', () => {
    return read('__test__/fixtures/fixture', {extensions: ['.text', '.markdown', '.md']})
      .then(data => {
        expect(data).not.toBe(null)
        expect(data.content.trim()).toBe('markdown')
        expect(data.file).toBe('__test__/fixtures/fixture.markdown')
      })
  })

  test('skip handler', () => {
    return read('__test__/fixtures/fixture', {
      extensions: ['.txt', '.md'],
      skipHandler: true
    }).then(data => {
      expect(data).not.toBe(null)
      expect(data.file).toBe('__test__/fixtures/fixture.md')
      expect(data.content).toBeUndefined()
    })
  })

  test('custom sync handler', () => {
    return read('__test__/fixtures/foo', {
      extensions: ['.ts', '.js'],
      handler(file) {
        // I know there's only foo.js
        // so no need for validation
        return require(path.join(process.cwd(), file))
      }
    }).then(data => {
      expect(data).toBe('wow')
    })
  })

  test('custom promise handler', () => {
    return read('__test__/fixtures/foo', {
      extensions: ['.ts', '.js'],
      handler(file) {
        return new Promise(resolve => {
          setTimeout(() => {
            const data = require(path.join(process.cwd(), file))
            resolve(data)
          })
        })
      }
    }).then(data => {
      expect(data).toBe('wow')
    })
  })
})

describe('it fails', () => {
  test('neither array nor string', () => {
    return read(123).catch(err => {
      expect(err.message).toBe('Expected file to be an array of string!')
    })
  })
})
