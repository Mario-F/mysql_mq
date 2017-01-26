'use strict'
const mmq       = require('../index.js')
const chai      = require('chai')
const should    = chai.should()

describe('Complete test mysql-mq', () => {
    let queue
    let testMessage = { message: 'test' }
    
    it('Create a Queue', (done) => {
        queue = new mmq('mmq_test', { database: 'mp_test' })
        queue.init((err) => {
            should.not.exist(err)
            done()
        })
    })
    
    it('Put an message to queue', (done) => {
        queue.put(testMessage.message, (err, idMessage) => {
            should.not.exist(err)
            testMessage.id_message = idMessage
            done()
        })
    })
    
    it('Get a message from queue', (done) => {
        queue.get((err, res) => {
            should.not.exist(err)
            res.id_message.should.equal(testMessage.id_message)
            res.message.should.equal(testMessage.message)
            done()
        })
    })
    
    it('Delete a message from queue', (done) => {
        queue.delete(testMessage.id_message, (err) => {
            should.not.exist(err)
            done()
        })
    })
    
    it('Close Queue', (done) => {
        queue.end((err) => {
            should.not.exist(err)
            done()
        })
    })
    
})