/*
    Metadata
*/

module.exports.create_table         =   "CREATE TABLE IF NOT EXISTS ?? (" +
                                        "`id` BIGINT NOT NULL AUTO_INCREMENT, " +
                                        "`message` LONGTEXT NOT NULL, " +
                                        "`visibility` TIMESTAMP NULL, " +
                                        "`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                                        "PRIMARY KEY (`id`))";
                             
module.exports.insert_message       =   "INSERT INTO ?? (message) VALUES (?)";

module.exports.get_next_message     =   "SELECT id, message FROM ?? " +
                                        "WHERE visibility IS NULL OR visibility < NOW() " +
                                        "ORDER BY id ASC LIMIT 1";

module.exports.lock_message         =   "UPDATE ?? SET visibility = DATE_ADD(NOW(), INTERVAL ? SECOND) " +
                                        "WHERE (visibility IS NULL OR visibility < NOW()) AND id = ?";
                                        
module.exports.delete_message       =   "DELETE FROM ??" +
                                        "WHERE id = ?";
                                        
module.exports.get_queue_info       =   `SELECT 
                                            (SELECT COUNT(1) FROM ??) as messages_count`