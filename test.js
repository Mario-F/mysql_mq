var x = require("./index");
var xc = new x('tape_test', { database: 'mp_test' });
var test = require("tape").test;

var test_message = 'TEST_MESSAGE';
var test_id = null;

test('Put an message to queue', (assert) => {
    xc.init((err) => {
        assert.equal(err, null, 'mysql-mq.init');
        xc.put(test_message, (err, id_message) => {
            assert.equal(err, null, 'mysql-mq.put');
            assert.ok(typeof id_message ===  typeof 0, 'Returnvalue ID_Message: '+id_message);
            xc.end((err) => {
                assert.equal(err, null, 'mysql-mq.end');
                assert.end();
            });
        });
    });
});

test('Get a message from queue and delete it', (assert) => {
    xc.init((err) => {
        assert.equal(err, null, 'mysql-mq.init');
        xc.get((err, res) => {
            assert.equal(err, null, 'mysql-mq.get');
            assert.ok(typeof res.id_message ===  typeof 0, 'Returnvalue ID_Message: '+res.id_message);
            assert.equal(res.message, test_message);
            xc.delete(res.id_message, (err) => {
                assert.equal(err, null, 'mysql-mq.delete');
                xc.end((err) => {
                    assert.equal(err, null, 'mysql-mq.end');
                    assert.end();
                }); 
            });
        });
    });
});

/*
xc.init(() => {
    xc.put('Das ist ein TEST!', (err, id) => {
        console.log(err);
        console.log(id);
        xc.end();    
    });
    xc.get((err, res) => {
        if(err) console.log(err);
        console.log(res);
        xc.delete(res.id_message, () => {
           if(err) console.log(err);
           xc.end();
        });
    });
});
*/