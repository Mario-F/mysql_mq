# MySQL Message Queue [![Build Status](https://travis-ci.org/Mario-F/mysql_mq.svg?branch=master)](https://travis-ci.org/Mario-F/mysql_mq)
mysql-mq offers a Message Queueing service like rsmq for example in mysql.

## Example usage
```javascript
var mmq = require("mysql-mq");
var testQueue = new mmq('mmq_test', { database: 'mp_example' });

testQueue.put('This is a Test!').then((res) => {
    console.log('Message got ID:', res)
    
    testQueue.get().then((res) => {
        console.log('Content of Message ID', res.id_message, res.message)
        
        testQueue.delete(res.id_message).then((res) => {
            console.log('Message deleted')
        })
    })
})
```