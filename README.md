# MySQL Message Queue [![Build Status](https://travis-ci.org/Mario-F/mysql_mq.svg?branch=master)](https://travis-ci.org/Mario-F/mysql_mq)
mysql-mq provides a message queueing service based on mysql.

Its not build to down to performance, either its optimized to provide a mysql backed message queue if no other queueing service is available or would be oversized for your application.

## Install
```javascript
$ npm install mysql-mq
```

## Usage
A queue will automatically created when not exists, this create process can be called manually with the "init" method or is executed on first usage of the queue.

### Example usage
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

## Development
Feel free to fork & contribute!

### Testing
Tests need a MySQL Server running, to simplify tests a docker environment can be used. (You need to have docker installed)

Test with docker:
```bash
npm run dockertest
```

Clear all docker containers:
```bash
npm run dockerend
```
