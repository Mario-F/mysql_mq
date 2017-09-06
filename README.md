# MySQL Message Queue [![Build Status](https://travis-ci.org/Mario-F/mysql_mq.svg?branch=master)](https://travis-ci.org/Mario-F/mysql_mq)
mysql-mq provides a feature rich message queueing service based on mysql.
Its not build to down to performance, either its optimized to provide a mysql backed message queue if no other queueing service is available or would be oversized for your application.

## Install
```javascript
$ npm install mysql-mq
```

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
