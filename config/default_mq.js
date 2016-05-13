/*
    Metadata
*/

module.exports.config_mq = {
    // Visibility timeout in seconds
    'vis_timeout':          10,
    // Will activate console.log outputs
    'debug':                false,
    // Timeout between lock attempts in ms
    'lock_timeout':         100,
}

module.exports.config_mysql = {
    'host':         'localhost',
    'port':         3306,
    'user':         'root',
    'password':     null,
    'database':     'mysql_mq'
}