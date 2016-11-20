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
})
