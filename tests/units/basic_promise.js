'use strict'
const chai      = require('chai')
const should    = chai.should()

module.exports = (store) => {
    
    describe('Test Promise', () => {
        let testMessage = { message: 'test' }
        
        it('Put an message to queue', (done) => {
            store.queue.put(testMessage.message)
            .then((res) => {
                testMessage.id_message = res
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
        
        it('Get a message from queue', (done) => {
            store.queue.get()
            .then((res) => {
                res.id_message.should.equal(testMessage.id_message)
                res.message.should.equal(testMessage.message)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
        
        it('Delete a message from queue', (done) => {
            store.queue.delete(testMessage.id_message)
            .then((res) => {
                should.not.exist(res)
                done()
            })
            .catch((err) => {
                done(err)
            })
        })
    })
}