class SimDB {
  constructor (opts = {}) {
    opts = Object.assign({}, {
      dbName: 'simdb',
      storeName: 'defaultstore'
    }, opts)

    this._options = opts
    this._store = null

    this.ready = new Promise((resolve, reject) => {
      let request = window.indexedDB.open(opts.dbName)

      request.onupgradeneeded = (event) => {
        this._db = event.target.result
        this._db.createObjectStore(opts.storeName)
      }

      request.onsuccess = (event) => {
        this._db = event.target.result
        resolve()
      }

      request.onerror = createErrorHandler('open', opts, reject)

      request.onclose = () => console.log('db closed')
    })

    // TODO: consider handling onclose event
  }

  delete (key) {
    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        const request = this.store.delete(key)
        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = createErrorHandler('delete', this._options, reject)
      })
    })
  }

  deleteDB () {
    return this.ready.then(() => {
      this._db.close()
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase(this._options.dbName)
        request.onsuccess = () => resolve()
        request.onerror = createErrorHandler('deleteDB', this._options, reject)
      })
    })
  }

  get (key) {
    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        const request = this.store.get(key)
        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = createErrorHandler('get', this._options, reject)
      })
    })
  }

  set (key, value) {
    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        const request = this.store.put(value, key)
        request.onsuccess = resolve
        request.onerror = createErrorHandler('set', this._options, reject)
      })
    })
  }

  get store () {
    return this._db
      .transaction([this._options.storeName], 'readwrite') // consider using nonstandard 'readwriteflush'
      .objectStore(this._options.storeName)
  }
}

SimDB.create = function createSimDB (opts) {
  return new SimDB(opts)
}

function createErrorHandler (method, opts, reject) {
  return function SimDBErrorHandler (event) {
    const msg = `SimDB ${method} error for db ${opts.dbName} and store ${opts.storeName}. Error code: ${event.target.errorCode}.`
    const err = new Error(msg)
    console.error(msg)
    reject(err)
  }
}

module.exports = (function () {
  const defaultSimDB = SimDB.create()
  defaultSimDB.create = SimDB.create
  return defaultSimDB
})()
