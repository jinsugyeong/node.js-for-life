var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'jinsugyeong',
    'password':'as0098',
    database:'opentutorials'
});
db.connect();
module.exports = db;