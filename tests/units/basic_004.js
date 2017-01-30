'use strict'
const chai      = require('chai')
const should    = chai.should()

module.exports = (store) => {
    
    describe('0.0.4 Compatibility', () => {
        let testMessage = { message: 'test' }
        
        it('Put an message to queue', (done) => {
            store.queue.put(testMessage.message, (err, idMessage) => {
                should.not.exist(err)
                testMessage.id_message = idMessage
                done()
            })
        })
        
        it('Get a message from queue', (done) => {
            store.queue.get((err, res) => {
                should.not.exist(err)
                res.id_message.should.equal(testMessage.id_message)
                res.message.should.equal(testMessage.message)
                done()
            })
        })
        
        it('Delete a message from queue', (done) => {
            store.queue.delete(testMessage.id_message, (err) => {
                should.not.exist(err)
                done()
            })
        })
    })
}