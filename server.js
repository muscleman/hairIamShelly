// server.js

    // set up ========================
    var express         = require('express');
    var app             = express();                               // create our app w/ express
    var mongoose        = require('mongoose');                     // mongoose for mongodb
    var port            = process.env.PORT || 8080;
    var database        = require('./config/database');
    var path            = require('path');
    
    // var cookies         = require('cookies');

    var morgan          = require('morgan');             // log requests to the console (express4)
    var bodyParser      = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride  = require('method-override'); // simulate DELETE and PUT (express4)


    // configuration =================

    // mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
    //mongoose.connect('mongodb://localhost/nodetest1');
    mongoose.connect(database.url);
    app.set('superSecret', database.secret);

    app.use(express.static(path.join(__dirname, 'public/')));       // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

    // app.use(function(req, res, next) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    //     res.setHeader('Access-Control-Allow-Headers', 'x-session-token, content-type, Authorization');
    //     next();
    // });

    app.use(methodOverride());

    // routes ======================================================================
    require('./app/routes.js')(app);

    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port " + port);


