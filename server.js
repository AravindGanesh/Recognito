// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var shell      = require('node-cmd');
var tcp        = require('tcp-proxy');


var server = tcp.createServer({
  target: {
    host: '127.0.0.1',
    port: 8080
  }
});

server.listen(8081);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var volDown = express.Router();              // get an instance of the express Router

volDown.use(function(req, res, next) {
	console.log('Volume Down 10%');

    shell.run('amixer -D pulse sset Master 10%-');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/volDown', volDown);

var volUp = express.Router();              // get an instance of the express Router

volUp.use(function(req, res, next) {
	console.log('Volume Up 10%');

    shell.run('amixer -D pulse sset Master 10%+');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/volUp', volUp);

var brightDown = express.Router();              // get an instance of the express Router

brightDown.use(function(req, res, next) {
	console.log('Brightness Lowered');

    shell.run('xrandr --output eDP1 --brightness 0.1');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/brightDown', brightDown);

var brightUp = express.Router();              // get an instance of the express Router

brightUp.use(function(req, res, next) {
	console.log('Brightness Max');

    shell.run('xrandr --output eDP1 --brightness 1');
    next(); // make sure we go to the next routes and don't stop here
});

app.use('/brightUp', brightUp);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port 8081');
