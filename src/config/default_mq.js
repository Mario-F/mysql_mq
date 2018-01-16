/*
    mysql-mq Default configuration
*/

module.exports.config_mq = {
    vis_timeout:    10,       // Visibility timeout in seconds
    lock_timeout:   100,      // Timeout between lock attempts in ms
}

module.exports.config_mysql = {
    host:               process.env.MYSQL_HOST      || 'localhost',
    port:               process.env.MYSQL_PORT      || 3306,
    user:               process.env.MYSQL_USER      || 'root',
    password:           process.env.MYSQL_PASS      || null,
    database:           process.env.MYSQL_DATABASE  || 'mysql_mq',
}
