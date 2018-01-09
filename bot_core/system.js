

var mysql = require('../node_modules/mysql');


var mysqlConfig = {
    host: 'localhost',
    user:'root',
    password: 'smile0759',
    database: 'hr'
};


var connection;

module.exports = function(){
    this.connectToDB = connectToDB;
    this.authentication = authentication;
}
connectToDB = function() {
    connection = mysql.createConnection(mysqlConfig);

    connection.connect(function(err){
        if(err){

        setTimeout(connectToDB, 2000);
        }
    });
    connection.on('error', function(err){
        systemMessage('db error: ' + err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            connectToDB();
        } else {
            throw err;
        }
    })
}


// Display log message in console

systemMessage = function(message){
    console.log('================================================')
    console.log(message);
    console.log('================================================')

}


//employee auth

authentication = function (session){
    //find employee
    console.log('=================================================');
    console.log(session.userData.username);
    console.log(session.userData.password);
    console.log('=================================================');
    connection.query('SELECT * FROM employees WHERE username = ? AND password = ? LIMIT 1', [
        session.userData.username, session.userData.password
    ], 
    function (err, rows, fields){
    if (!err){
        if (rows.length){
            //save employee info
            session.userData.auth = true;
            session.userData.employee_id = rows[0].id;
            session.userData.sickDays = rows[0].sick_days;

            session.send('Welcome %s %s! How can I help you?', rows[0].first_name, rows[0].last_name);
            session.replaceDialog('/membersMenu');
        } else {
            // wrong username or password
            session.send("Sorry.. Those didn't match our records... Please Try again!");

        }
    } else {
        session.send("Error getting data from DB %s", err);
    }
    
    });
};