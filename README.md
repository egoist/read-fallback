# read-fallback

[![NPM version](https://img.shields.io/npm/v/read-fallback.svg?style=flat-square)](https://npmjs.com/package/read-fallback) [![NPM downloads](https://img.shields.io/npm/dm/read-fallback.svg?style=flat-square)](https://npmjs.com/package/read-fallback) [![Build Status](https://img.shields.io/circleci/project/egoist/read-fallback/master.svg?style=flat-square)](https://circleci.com/gh/egoist/read-fallback)

## Install

```bash
$ npm install --save read-fallback
```

## Usage

Assume that I have a `foo.txt` with content `bar`:

```js
const read = require('read-fallback')

// it looks for foo.md, sure it does not exist
// then it looks for foo.txt, there it is
// the last foo.xxx is skipped
read('foo', {extensions: ['.md', '.txt', '.xxx']})
  .then(data => {
    if (data) {
      console.log(data.file, data.content)
      //=> foo.txt 'bar'
    } else {
      console.log('no matching file!')
    }
  })

// use an array of file paths directly
// because sometimes the filename is different too
read(['foo.txt', 'bar.md'])
```

## API

### readFallback(input, [options])

#### input

Type: `string` or `array`

An array of file paths or a single file name.

#### options

##### extensions

Type: `array`  

Used when `input` is a string, eg: 

```js
// looks for gulpfile.js then gulpfile.babel.js
read('gulpfile', {extensions: ['.js', '.babel.js']})

// if no extensions:
// it simply reads `foo` only, without any extension
// but yeah, it's not a common case
read('foo')
```

#### handler

Type: `function`

Specific a handler function for reading file content, by default it's a promisified `fs.readFile` and returns `{file, content}` in the end.

Any function which returns a Promise or does synchronus operations is valid.

```js
// you don't know what you have
// but if a.js exists you do this
// if a.ts exists you do that
read(['a.js', 'a.ts'], {
  handler(file, index) {
    if (file === 'a.js') return require(path.resolve(file))
    if (file === 'a.ts') return require(someTypeScriptParser(file))
  }
}).then(data => {
  // the data isn't `{file, content}` anymore
  // it's what you return in the last step
  // here it's the result of require
})
```

#### skipHandler

Type: `boolean`<br>
Default: `false`

Simply return matched file path instead of using a handler function to read its content. In this way:

```js
// assume we have b.js
read(['a.js', 'b.js'], {skipHandler: true})
  .then(data => {
    console.log(data)
    //=> {file: 'b.js'}
    // no data.content !!!
  })
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT](https://egoist.mit-license.org/) © [EGOIST](https://github.com/egoist)
