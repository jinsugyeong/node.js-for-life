var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'jinsugyeong',
    password : 'as0098',
    database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * FROM topic', function(error, results, fields) {
    if(error){
        console.log(error);
    };
    console.log(results);
});
connection.end();