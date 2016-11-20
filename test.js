const assert = require('assert')
const SimDB = require('./')

/* global afterEach, beforeEach, it, describe */
// trinity: mocha

function ita (desc, testFn) {
  it(desc, (done) => {
    testFn().then(done).catch(done)
  })
}

describe('simdb', () => {
  const dbName = 'simdb-test'
  let simdb

  beforeEach(() => {
    simdb = SimDB.create({ dbName })
  })

  afterEach(done => {
    simdb.deleteDB().then(done).catch(done)
  })

  ita('should set / get keys and values', async () => {
    await simdb.set('somekey', 'somevalue')
    const val = await simdb.get('somekey')
    assert.strictEqual(val, 'somevalue')
  })

  ita('should return undefined if key does not exist', async () => {
    const val = await simdb.get('key-does-not-exist')
    assert(typeof val === 'undefined')
  })

  ita('should not return an error if the key doesnt exist on delete', async () => {
    await simdb.delete('key-really-does-not-exist')
  })

  ita('should store integers as keys', async () => {
    await simdb.set(4, 'the num 4')
    const val = await simdb.get(4)
    assert.strictEqual(val, 'the num 4')
  })

  /*
  // not yet
  ita('should be able to store Buffer', async () => {
    var buf = Buffer.from('hello world!', 'utf8')
    await simdb.set('somebuf', buf)
    const val = await simdb.get('somebuf')
    console.log(Buffer.isBuffer(val))
    console.dir(val)
  })
  */
})
