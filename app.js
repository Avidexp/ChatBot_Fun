var restify = require('restify');
var builder = require('botbuilder');
var crypto = require('crypto');
//Bot modules
var BotMenu = require('./bot_core/menu');
var BotSystem = require('./bot_core/system');


//=======================================
// Bot Setup
//=======================================

var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function(){
    console.log('%s listening...', server.name);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});


var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

//init bot system module
var system = new BotSystem();

//connect to sql
system.connectToDB();


// init bot menu module
var menu = new BotMenu();
menu.init(bot,builder);


//=======================================
// Bot Dialog
//=======================================



var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^version/i, builder.DialogAction.send('Bot Version: 1.0.0 '));
//default dialog
intents.onDefault(function(session){
    if(session.userData.auth){
        session.beginDialog('/membersMenu');
    } else {
        session.beginDialog('/guestMenu');
    }
});


bot.dialog('/holidays',[ function(session){
    session.send("New Year's Day, January 1, Sunday");
    session.send("Good Friday, April 14, Friday");
    session.send("Victoria Day, May 22, Monday");
    session.send("Canada Day, July 1, Saturday");
    session.send("labour Day, September 4, Monday");
    session.send("Thanksgiving, October 9, Monday");
    session.send("Rememberance Day, November 11, Saturday");
    session.send("Christmas Day, December 25, Monday");

    session.endDialog();
    }
]);

bot.dialog('/logout',[
    function(session){
        //uset all data
        session.userData.employee_id = undefined;
        session.userData.username = undefined;
        session.userData.password = undefined;
        session.userData.sickDays = undefined;
        session.userData.auth = undefined;
        session.userData.admin = undefined;

        session.replaceDialog('/login');
    }
]);

bot.dialog('/login',[
    function(session, args, next){
        //ask for username
         if(!session.userData.username){
            builder.Prompts.text(session, 'Hi, what is your username?');
        } else {
            next();
        }
    }, function (session, results, next){
        //save username 
         //if (!session.userData.username && results.resonse){
            session.userData.username = results.response;
         //} 
        // //ask for password 
         if (!session.userData.password){
            builder.Prompts.text(session, 'Enter your password');
        } else {
             next();
         }
    }, function (session, results, next){
         if(!session.userData.password && results.response){
            session.userData.password = crypto.createHash('md5').update(results.response).digest('hex');
        }// 
        session.send("Checking login Credentials...");

        system.authentication(session);
    }
]);





