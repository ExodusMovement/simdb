const assert = require('assert')
const aw = require('aw')
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

  ita('should update key and value', async () => {
    await simdb.set('somekey', 'somevalue')
    const val = await simdb.get('somekey')
    assert.strictEqual(val, 'somevalue')

    await simdb.set('somekey', 'somevalueAGAIN')
    const val2 = await simdb.get('somekey')
    assert.strictEqual(val2, 'somevalueAGAIN')
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

  ita('does not store dates as keys', async () => {
    const d = new Date()
    const [err] = await aw(simdb.set.bind(simdb))(d, 'hi')
    assert(err)
  })

  ita('does not store objects as keys', async () => {
    const d = { name: 'jp' }
    const [err] = await aw(simdb.set.bind(simdb))(d, 'hi')
    assert(err)
  })
})
