"use strict"
/*
    Metadata
*/

const _ = require("lodash");
const _db = require("./db_operations");

class MySQLMQ 
{
    constructor(queue, config_mysql, config_mq) {
        // Check for Queuename if not set throw exception
        if(!queue) throw new Error('A queue must be set!');
        
        // Set Configurations
        this._queue = queue;
        this._config_mysql = _.defaults(config_mysql ? config_mysql : {}, require("../config/default_mq").config_mysql);
        this._config_mq = _.defaults(config_mq ? config_mq : {}, require("../config/default_mq").config_mq);
    }
    
    // Initialize all necessary connections and executes callback(err)
    init(callback) {
        _db.setConnection(this._queue, this._config_mysql, (err) => {
            if(err) return callback(err);
            return callback(null);
        }); 
    }
    
    // End all connections (otherwise the mysql connection pool will block the node eventloop)
    end(callback) {
        _db.end((err) => {
            if(callback) return callback(err);
        });
    }
    
    // Push a message to the queue and returns the message_id
    put(message, callback) {
        _db.query(require('./db_statements').insert_message, [this._queue, message], (err, res) => {
            if(err) { if(callback) { return callback(err) } else { throw err } }
            if(callback) {
                if(!res.insertId) return callback(new Error('There was an error while inserting to database!'));
                return callback(null, res.insertId);
            }
        });
    }
    
    // Get a message from the queue, returns null if queue is empty
    get(callback) {
        var queueName = this._queue;
        var configMq = this._config_mq;
        (function getMessage() {
            _db.query(require('./db_statements').get_next_message, [queueName], (err, resMes) => {
                if(err) return callback(err);
                if(resMes.length == 0) return callback(null, null);
                _db.query(require('./db_statements').lock_message, [queueName, configMq.vis_timeout, resMes[0].id], (err, res) => {
                    if(err) return callback(err);
                    if(res.affectedRows == 1) {
                        callback(null, { id_message: resMes[0].id, message: resMes[0].message});
                    } else {
                        setTimeout(getMessage, configMq.lock_timeout);
                    }
                });
            });
        })();
    }
    
    // Delete a message from the queue by ID
    delete(id_message, callback) {
        _db.query(require('./db_statements').delete_message, [this._queue, id_message], (err, res) => {
            if(err) return callback(err);
            if(res.affectedRows == 0) return callback(new Error('Message ID not found.'));
            callback(null);
        });
    }
    
    getConfig() {
        return this._config_mq;
    }
    setConfig(config) {
        this._config_mq = _.defaults(config, this._config_mq);
    }
}

module.exports = MySQLMQ;