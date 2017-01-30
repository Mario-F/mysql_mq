'use strict'
const debug     = require('debug')('mysqlmq:lib:dboperations')
const mysql     = require('mysql2')

module.exports = function dbOperations(config, queuename) {
    let expose = {}
    let connection = mysql.createConnection(config)

    connection.query(require('./db_statements').create_table, [queuename], (err, result) => {
        if(err) 
            throw err
    })
    
    expose.end = (callback) => {
        if(!config.persistent) 
            return callback(null)
        connection.end(callback)
    }
    
    expose.query = (query, params, callback) => {
        connection.query(query, params, (err, res) => {
            if(config.persistent) {
                return connection.end((err) => {
                    if(err) return callback(err)
                })
            }
            if(err) return callback(err)
            return callback(null, res)
        })
    }
    
    return expose
}