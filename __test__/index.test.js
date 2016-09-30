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

  test('skip readFile', () => {
    return read('__test__/fixtures/fixture', {
      extensions: ['.txt', '.md'],
      skipReadFile: true
    }).then(data => {
      expect(data).not.toBe(null)
      expect(data.file).toBe('__test__/fixtures/fixture.md')
      expect(data.content).toBeUndefined()
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
