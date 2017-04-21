'use strict'
const chai      = require('chai')
const should    = chai.should()

module.exports = (store) => {
    
    describe('Queue Operations', () => {
        
        it('Delete Queue', (done) => {
            store.queue.queueDelete()
            .then((res) => {
                done()
            })
            .catch(done)
        })
        
        it('Error on no queue', (done) => {
            store.queue.get()
            .then((res) => {
                done(res)
            })
            .catch((err) => {
                err.errno.should.equal(1146)
                done()
            })
        })
        
    })
}