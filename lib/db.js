var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restfull',
});
conn.connect(function(err){
    if(!!err){
        console.log(err);
    }else{
        console.log('Connected ...!');
    }
});
module.exports = conn;