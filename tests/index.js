'use strict'
const mmq       = require('../index.js')
const chai      = require('chai')
const should    = chai.should()

describe('Complete test mysql-mq', () => {
    let store = {
        queue: null
    }
    
    describe('Prepare', () => {
        it('Create a Queue (Deprecated)', (done) => {
            store.queue = new mmq('mmq_test', { database: 'mp_test' })
            store.queue.init((err) => {
                should.not.exist(err)
                done(err)
            })
        }).timeout(15000) // High timeout due Travis-CI tests
    })
    
    describe('Basic usage', () => {
        require('./units/basic_004')(store)
        require('./units/basic_promise')(store)
        require('./units/queue_operations')(store)
    })
    
    describe('Unprepare', () => {
        it('Close Connection', (done) => {
            store.queue.end((err) => {
                should.not.exist(err)
                done(err)
            })
        })
    })
    
})