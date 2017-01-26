# MySQL Message Queue
[![Build Status](https://travis-ci.org/Mario-F/mysql_mq.svg?branch=master)](https://travis-ci.org/Mario-F/mysql_mq)
mysql-mq offers a Message Queueing service like rsmq for example in mysql.

## Example usage
```javascript
var mmq = require("mysql-mq");
var testQueue = new mmq('mmq_test', { database: 'mp_test' });

testQueue.init((err) => {
    if(err) throw err;
    testQueue.put('This is a Test!', (err, id) => {
        if(err) return console.log(err);
        console.log('Message got ID: '+id);
        testQueue.get((err, res) => {
            if(err) return console.log(err);
            console.log('Content of Message ID: '+res.id_message);
            console.log(res.message);
            testQueue.delete(res.id_message, (err) => {
               if(err) return console.log(err);
               testQueue.end();
            });
        });
    });
});
```