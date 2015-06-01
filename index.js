var express = require('express'),
    app     = express(),
    adaro = require('adaro'),
    Twitter = require('twitter');
 
var twitterClient = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

// Set our view engine to Jade, and the view directory
//app.set('view engine', 'jade');

var options = {
  helpers: [
    //NOTE: function has to take dust as an argument.
    //The following function defines @myHelper helper
    function (dust) { dust.helpers.myHelper = function (a, b, c, d) {} },
    '../my-custom-helpers',   //Relative path to your custom helpers works
    'dustjs-helpers',   //So do installed modules
    {
      name: '../my-custom-helpers/helper-to-render-data-with-args',
      // or use this signature if you need to pass in additional args
      arguments: { "debug": true }
    }
  ]
};

app.set('views', __dirname + '/views');

app.engine('dust', adaro(options));
app.set('view engine', 'dust');

// Enable our custom Logging middleware
app.use(function(req, res, next) {
  console.log('['+ new Date() +'] ', req.path);
  next();
});

// Our logName middleware, which can be used in any route we want.
var logName = function(req, res, next) {
  console.log('Request to '+ req.params.name);
  next();
}

// Our two routes and handlers
app.get('/', function(req, res){
    twitterClient.get('statuses/user_timeline', { screen_name: 'govsingapore'}, function(error, tweets, response){
      if(error) throw error;
      console.log(tweets);  // The gov.sg tweets. 
      console.log(response);  // Raw response object. 
    });
  res.send('Hello World, From /');
});
app.get('/:name', logName, function(req, res){
  res.render('index', {name: req.params.name});
});

// Finally, start our web server.
var server = app.listen(3000, '0.0.0.0', function() {
  console.log('Listening on port %d', server.address().port);
});