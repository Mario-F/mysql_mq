'use strict'
const chai      = require('chai')
const should    = chai.should()

it('Example Usage', (done) => {
    var mmq = require('../../../index.js');
    var testQueue = new mmq('mmq_example', { database: 'mp_test' });

    testQueue.put('This is a Test!').then((res) => {
        res.should.equal(1)

        testQueue.get().then((res) => {
            res.id_message.should.equal(1)
            res.message.should.equal('This is a Test!')

            testQueue.delete(res.id_message).then((res) => {

                testQueue.queueDelete().then((res) => {
                    done()

                }).catch(done)
            }).catch(done)
        }).catch(done)
    }).catch(done)
}).timeout(5000)
