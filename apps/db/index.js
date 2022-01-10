exports.connection = (mysql) => {
    let dbConfig = require("@config/db.config")
    let connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
    })
    connection.connect();
    return connection
}