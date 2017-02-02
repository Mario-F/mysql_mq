'use strict'
require('es-nodeify')
const debug     = require('debug')('mysqlmq:mysqlmq')
const _         = require('lodash')
const mqDefault = require('./config/default_mq')
const stmt      = require('./lib/db_statements')

class MySQLMQ 
{
    constructor(queue, config_mysql, config_mq) {
        // Check for Queuename if not set throw exception
        if(!queue) 
            throw new Error('A queue must be set!')
        
        // Set Configurations
        this._queue = queue
        this._config_mysql = _.defaults(config_mysql ? config_mysql : {}, mqDefault.config_mysql)
        this._config_mq = _.defaults(config_mq ? config_mq : {}, mqDefault.config_mq)
        
        // Create Database object
        this._db = require('./lib/db_operations')(this._config_mysql, this._queue)
    }
    
    // Initialize all necessary connections and executes callback(err)
    // Deprecated, check if queue table 
    init(callback) {
        return new Promise((resolv, reject) => {
            this._db.query(stmt.get_queue_info, [this._queue], (err, res) => {
                if(err) 
                    return reject(err)
                resolv(res)
            })
        }).nodeify(callback)
    }
    
    // End mysql connection
    end(callback) {
        return new Promise((resolv, reject) => {
            this._db.end((err) => {
                if(callback) return callback(err)
            })
        }).nodeify(callback)
    }
    
    // Delete the Queue table
    queueDelete(callback) {
        return new Promise((resolv, reject) => {
            this._db.query(stmt.delete_queue, [this._queue], (err, res) => {
                if(err) { 
                    return reject(err)
                }
                resolv(res)
            })
        }).nodeify(callback)
    }
    
    // Push a message to the queue and returns the message_id
    put(message, callback) {
        return new Promise((resolv, reject) => {
            this._db.query(stmt.insert_message, [this._queue, message], (err, res) => {
                if(err) { 
                    return reject(err)
                }
                if(!res.insertId) {
                    return reject(new Error('There was an error while inserting to database!'))
                }
                return resolv(res.insertId)
            })
        }).nodeify(callback)
    }
    
    // Get a message from the queue, returns null if queue is empty
    get(callback) {
        return new Promise((resolv, reject) => {
            (function getMessage() {
                this._db.query(stmt.get_next_message, [this._queue], (err, resMes) => {
                    if(err) { 
                        return reject(err)
                    }
                    if(resMes.length == 0) {
                        return resolv(null)
                    }
                    this._db.query(stmt.lock_message, [this._queue, this._config_mq.vis_timeout, resMes[0].id], (err, res) => {
                        if(err) {
                            return reject(err)
                        }
                        if(res.affectedRows == 1) {
                            return resolv({ id_message: resMes[0].id, message: resMes[0].message})
                        }
                        setTimeout(getMessage, this._config_mq.lock_timeout)
                    })
                })
            }).bind(this)()
        }).nodeify(callback)
    }
    
    // Delete a message from the queue by ID
    delete(id_message, callback) {
        return new Promise((resolv, reject) => {
            this._db.query(stmt.delete_message, [this._queue, id_message], (err, res) => {
                if(err) { 
                    return reject(err)
                }
                if(res.affectedRows == 0) {
                    return reject(new Error('Message ID not found.'))
                }
                return resolv()
            })
        }).nodeify(callback)
    }
    
    getConfig() {
        return this._config_mq;
    }
    setConfig(config) {
        this._config_mq = _.defaults(config, this._config_mq);
    }
}

module.exports = MySQLMQ;