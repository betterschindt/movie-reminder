var config = require('./config');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var apiRoutes = require('./app/routes/api')(app, express);


// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});


// log all requests to the console
app.use(morgan('dev'));
mongoose.connect(config.database);


app.use(express.static(__dirname + '/public'));


//our routes
app.use('/user_api', apiRoutes);

//catch all route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//start
app.listen(config.port);
console.log('port:' + config.port);