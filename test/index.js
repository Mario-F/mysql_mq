'use strict'
const wtf = require('wtfnode')

describe('Version 0.2.0 - TEST', () => {
  require('./version020')
})

describe('Version 0.4.0 - TEST', () => {
  require('./version040')
})

describe('END', () => {
    it('Check running requests', (done) => {
        wtf.dump()
    })
})
