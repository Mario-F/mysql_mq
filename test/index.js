'use strict'
// When debug is used check for blocking async tasks at end of tests
if(process.env.DEBUG) {
    var wtf = require('wtfnode') // eslint-disable-line no-inner-declarations
}

describe('Version 0.2.0 - TEST', () => {
  require('./version020')
})

describe('Version 0.4.0 - TEST', () => {
  require('./version040')
})

// When debug is used check for blocking async tasks at end of tests
if(process.env.DEBUG) {
    describe('WTF NDOE', () => {
        it('Check running requests', (done) => {
            wtf.dump()
            done()
        })
    })
}
