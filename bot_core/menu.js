module.exports = function () {
    this.init = init;
}

init = (bot, builder) => {
    // menu for autherized members
    bot.dialog('/guestMenu', [
        function(session){
            builder.Prompts.choice(session, 'Choose an option:', 'Login|Dispay Holidays|Quit');
        }, function (session, results){
            switch (results.response.index){
                case 0:
                    session.beginDialog('/login');
                    break;
                
                case 1:
                    session.beginDialog('/holidays');
                    break;
                default:
                    session.endDialog();
            }
        },
        function(session){
            if(session.userData.auth){
                session.replaceDialog('membersMenu');
            } else{
                session.replaceDialog('guestMenu');
            }
        }
    ]);

        bot.dialog('/membersMenu',[
            function(session){
                builder.Prompts.choice(session, 'Choose an option:', 'New employee|Sick day|Logout|Quit');
            }, function (session, results){
                switch (results.response.index){
                    case 0:
                        session.beginDialog('/new_employee');
                        break;
                    
                    case 1:
                        session.beginDialog('/sick_day');
                        break;
                    case 2:
                        session.beginDialog('/logout');
                        break;
                        default:
                        session.endDialog();
                        break;
            }
        }, function(session){
            if(session.userData.auth){
                session.replaceDialog('/membersMenu');
            } else {
                session.replaceDialog('/guestMenu');
            }
        }
    ]);


    


}