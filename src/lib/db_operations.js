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

    // Variables
    let iCountQueries = 0

    // Handle queries executed before table structure create is finished
    let ready = false
    const qPending = []
    function execWhenReady(execCall) {
        if(ready)
            return execCall()

        debug('Query was set for pending')
        qPending.push(execCall)
    }

    // On Function call setup database structure
    debug('Create table structure for queue', queuename, 'if not exists')
    const connection = mysql.createConnection(config)
    connection.query(require('../sql/db_statements').create_table_data, [queuename], (err, result) => {
        debug('Create table structure finished')
        if(err)
            throw err

        connection.end((err) => {
            debug('Create table connection ended')
            if(err)
                throw err

            ready = true
            debug('Executing pending queries')
            qPending.forEach(cl => cl())
        })
    })

    // Create execution function and passes it to execWhenReady, will execute when dbOperations is initialized
    expose.query = (query, params, callback) => {
        // Add id to query for debugging
        iCountQueries++
        const idQuery = iCountQueries
        debug(idQuery, 'Query calling')

        // Pass query to executor
        execWhenReady(() => {
            debug(idQuery, 'Query executing')
            const qConnection = mysql.createConnection(config)
            qConnection.query(query, params, (qErr, res) => {
                debug(idQuery, 'Query finished')
                return qConnection.end((eErr) => {
                    debug(idQuery, 'Query ended')
                    if(qErr)
                        return callback(qErr)
                    if(eErr)
                        return callback(eErr)

                    return callback(null, res)
                })
            })
        })
    }

    // Deprecated: Remove when concept for persistent and non persistent connections in final stage
    expose.end = (callback) => {
        if(!config.persistent)
            return callback(null)

        connection.end(callback)
    }

    return expose
}
