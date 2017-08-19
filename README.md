simdb
=====

[![npm](https://img.shields.io/npm/v/simdb.svg?style=flat-square)](https://www.npmjs.com/package/simdb)
[![Build Status](https://travis-ci.org/ExodusMovement/simdb.svg?branch=master)](https://travis-ci.org/ExodusMovement/simdb)
[![JavaScript standard style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

Simple key / value wrapper on IndexedDB.


Install
-------

    npm i --save simdb

Usage
-----

```JavaScript
const SimDB = require('simdb')
const simdb = SimDB.create()

// Using await-style
await simdb.set('key', 'value')
await simdb.get('key') // -> 'value'
await simdb.delete('key')

// Using promise-style
simdb.get('key').then((value) => {
  /* ... */
}).catch((err) => {
  /* ... */
})

// Delete database
simdb.deleteDB()
```

Credit
------

Inspiration from:

- https://gist.github.com/wilsonpage/01d2eb139959c79e0d9a
- https://github.com/localForage/localForage


License
-------

MIT Copyright (c) 2016, Exodus Movement, Inc.
