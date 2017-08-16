var Alexa = require('alexa-sdk');
var request = require('request');

var summonerId = '';

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = '';

    if ( event.session.user.accessToken == undefined) {
      alexa.emit(':tellWithLinkAccountCard', 'To start using this skill, please use the companion app to authenticate on Amazon.');
      return;
    }

  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask','Hello scrub!  Welcome to league champion mastery.');
  },


  'SetSummonerIntent': function () {
    var summonerId = this.event.request.intent.slots.summonerId;
    // this.emit('LeagueSummonerIntent');
  },

  'LeagueSummonerIntent': function() {
    //var summonerId = this.event.request.intent.slots.summonerId;
    var summonerId = '';

    //, 'find three five zero two four one eight three'; // Since Easters: '22071468'deathbot360 summoner ID: 35024183
   
    var api_key = '';

    //generate the url
    var endpoint = ('https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/'
                    + summonerId + '?api_key=' + api_key);

    request.get(endpoint,(error, response, body) => {
    if(response.statusCode !== 200) {
        console.log('There was an error processing your request 2. Here\'s what what happened: ' +
                    response.statusCode + ' ' + response.statusMessage);
        this.emit(":tell", " I could not find the Summoner. endpoint");
    } else {
        //parse the data into a JSON object    
            var data = JSON.parse(body);
            var mastery = data[0].championLevel;
            var championId = data[0].championId;
            var championName = ('https://na1.api.riotgames.com/lol/static-data/v3/champions/'
                                + championId + '?locale=en_US&api_key=' + api_key);
            
            request.get(championName, (error, response, body) => {
              if(response.statusCode !== 200){
                console.log('There was an error processing your request. Here\'s what what happened: ' +
                            response.statusCode + ' ' + response.statusMessage);
                this.emit(":tell", " I could not find the Summoner.");
              } else {
                var champion = JSON.parse(body).name;
                var title = JSON.parse(body).title;
                this.emit(":tell","Your best champion is, " + champion + ', ' + title +", The mastery level is, " + mastery);
              };
            });
        };
    });
  },

  'AMAZON.StopIntent' : function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can tell me a seven digit summoner I.D. and I will tell you about their account.  Who would you like me to find?`,  `Who would you like me to find?`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `You can tell me a seven digit summoner I.D. and I will tell you about their account.  Who would you like me to find?`,  `Who would you like me to find?`);
  }

};