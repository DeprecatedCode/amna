'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Start
 */
var http = require('http');

module.exports = function (amna, log) {
    return function (config, done) {

        /**
         * Set settings
         */
        if (!config.settings || typeof config.settings !== 'object') {
            config.settings = {};
        }
        Object.keys(config.settings).forEach(function (key) {
            amna.$express.set(key, config.settings[key]);
        });

        /**
         * Set log path
         */
        amna.$LOG_PATH = process.cwd();
        if (typeof config.log === 'string' && config.log.length) {
            if (config.log[0] === '/') {
                amna.$LOG_PATH = config.log;
            }
            else {
                amna.$LOG_PATH += '/' + config.log;
            }
        }
        else {
            amna.$LOG_PATH += '/logs/amna.log';
        }

        log('Setting default log path to', amna.$LOG_PATH);

        /**
         * Connect to mongo
         */
        amna.mongo.connect(config.mongo, function () {
            log('database connected');

            /**
             * Authentication
             */
            if (typeof amna.authentication === 'function') {
                amna.authentication = amna.authentication();
            }

            /**
             * Connect to auth service and continue when ready
             */
            amna.$auth(function () {

                /**
                 * Register all normal modules here
                 */
                amna.$registerModules();

                /**
                 * Error handling
                 */
                amna.$express.use(function (err, req, res, next) {
                    if (next.noop) { // Argument next is required
                        next.noop();
                    }
                    if (typeof err !== 'object') {
                        var toError = new Error();
                        toError.reason = err;
                        err = toError;
                    }
                    err.status = err.status || 500;
                    log.request(req, 'HTTP', err.status, err);
                    var reason = 'Unknown Error';
                    if (err.status === '500') {
                        reason = 'Server Error';
                    }
                    else if (err.reason) {
                        reason = err.reason;
                    }
                    else if (err.message) {
                        reason = err.message;
                    }
                    if (!res.headersSent) {
                        res.status(err.status).json(amna.responses.error(reason));
                    }
                });

                /**
                 * No route matched
                 */
                amna.$express.use(function (req, res, next) {
                    if (next.noop) { // Argument next is required
                        next.noop();
                    }
                    log.request(req, 'HTTP', 404, 'Not Found');
                    res.status(404).json(amna.responses.error('Not Found'));
                });

                /**
                 * Start the express app
                 */
                if (!config.console) {
                    amna.$http = http.createServer(amna.$express);
                    amna.$http.listen(config.port || 8080, done);
                }
            });
        });
    };
};
