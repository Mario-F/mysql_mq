"use strict"
/*
    Metadata
*/

const mysql = require("mysql2")

let _pool = null;

let main = {};

main.setConnection = (queue, config, callback) => {
    _pool = mysql.createPool(config);
    main.query(require('./db_statements').create_table, [queue], (err, result) => {
        if(err) return callback(err);
        return callback(null, result);
    });
};

main.end = (callback) => {
    if(_pool) {
        _pool.end(() => callback(null));
    }
};

main.query = (query, params, callback) => {
    _pool.getConnection((err, connection) => {
        if(err) return callback(err);
        
        connection.query(query, params, (err, res) => {
            connection.release();
            if(err) return callback(err);
            return callback(null, res);
        });
    });
};

module.exports = main;