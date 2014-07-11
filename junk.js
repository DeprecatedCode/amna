

,
    winston = require('winston'),
    expressWinston = require('express-winston')


app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            colorize: true
        })
    ],
    meta: false,
    msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}} ({{res.responseTime}}ms)\n"
}));

// documentGet / Post / Put / Delete
self.model will be populated!

schema: function (name, defn)

,
    mongoose = require('mongoose')
    Email = mongoose.SchemaTypes.Email;

    var mongoose = require('mongoose'),
    mongooseTypes = require("mongoose-types"),
    findOrCreate = require('mongoose-findorcreate'),
    textSearch = require('mongoose-text-search');

mongooseTypes.loadTypes(mongoose);

var Url = mongoose.SchemaTypes.Url;


var Ref = function (name) {
    return {type: mongoose.Schema.ObjectId, ref: name};
};

s.Dish.plugin(textSearch);

s.Dish.index({name: 'text', cuisine: 'text'});

    e.schemas[name].plugin(findOrCreate);
    e[name] = mongoose.model(name.toLowerCase().replace('_', '-'), e.schemas[name]);

        restaurant: amna.refs.Restaurant,

Restaurant.model
Restaurant.schema.statics


var mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require('body-parser')
    winston = require('winston'),
    expressWinston = require('express-winston'),
    bodyParser = require('body-parser');

operations = require('./api/_operations'),

/**
 * Create the app and listen for API requests
 */
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

/**
 * Throw a client error - HTTP 400
 */
app.err = function (msg) {
    var e = new Error(msg);
    e.status = 400;
    throw e;
};

/**
 * Request Logging
 */
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: 'logs/requests.log'
        })
    ]
}));

*/
foodprint.start({
    mongo: 'localhost/foodprint-dev',
    port: 8080,
    settings: {

var prefix = '/api/0';

app.init = function (mongo, next) {
    
    authentication.init(app);

    /**
     * Connect to Mongo
     */
    mongoose.connect(mongo, function(err) {
        if (err) throw err;
        app.log();
        app.log('Connected to database: ' + mongo);

        authentication.middleware(app);

        app.use(function (req, res, next) {
            var auth;
            try { auth = JSON.parse(req.query.auth); } catch (e) {}
            req.scope = {
                user: req.user,
                auth: auth
            };
            next();
        })

        /**
         * Error handling
         */
        app.use(function (err, req, res, next) {
            res.json(err.status || 500, operations.responses.error(err.message || err));
        });

        /**
         * No route matched
         */
        app.use(function (req, res, next) {
            res.json(404, operations.responses.error('Not Found'));
        });

        /**
         * Setup Logging
         */
        app.use(expressWinston.errorLogger({
            transports: [
                new winston.transports.Console({
                    json: true,
                    colorize: true
                }),

                new winston.transports.File({
                    filename: 'logs/error.log'
                })
            ]
        }));

        next && next();
    });
};