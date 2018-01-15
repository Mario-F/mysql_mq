'use strict'
const debug     = require('debug')('mysqlmq:lib:dboperations')
const mysql     = require('mysql2')

/**
 * Handles database connection and queries including creating table structure if not exists
 * @constructor
 * @param {object} - mysql related configuration options
 * @param {string} queuename - Name of the queue
 */
module.exports = function dbOperations(config, queuename) {
    // Object to return
    const expose = {}

    // Handle queries executed before table structure create is finished
    let ready = false
    const qPending = []
    function execWhenReady(execCall) {
        if(ready) return execCall()
        qPending.push(execCall)
    }

    // On Function call setup database structure
    // TODO: This is an async call, following query calls must be delayed till this statement returns
    debug('Create table structure for queue', queuename, 'if not exists')
    const connection = mysql.createConnection(config)
    connection.query(require('../sql/db_statements').create_table_data, [queuename], (err, result) => {
        if(err) throw err
        ready = true
    })

    expose.end = (callback) => {
        if(!config.persistent)
            return callback(null)
        connection.end(callback)
    }

    expose.query = (query, params, callback) => {
        execWhenReady(() => {
            connection.query(query, params, (err, res) => {
                if(!config.persistent) {
                    return connection.end((err) => {
                        if(err) return callback(err)
                        return callback(null, res)
                    })
                }
                if(err) return callback(err)
                return callback(null, res)
            })
        })
    }

    return expose
}
