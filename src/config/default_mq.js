/*
    mysql-mq Default configuration
*/

module.exports.config_mq = {
    vis_timeout:    10,       // Visibility timeout in seconds
    lock_timeout:   100,      // Timeout between lock attempts in ms
}

module.exports.config_mysql = {
    host:               'localhost',
    port:               3306,
    user:               'root',
    password:           null,
    database:           'mysql_mq',
}
