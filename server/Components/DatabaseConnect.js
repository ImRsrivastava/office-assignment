const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'assignment'
});

conn.connect((error) => {
    if(error) {
        console.log('Failed to connect mysql database:: ', JSON.stringify(error));  }
});

module.exports = conn;