/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * Main AMNA File
 *
 * === AMNA Callback Conventions ===
 *
 * done ........ function (err, value)
 *
 *    - or -
 *
 * self.next ... function (value)
 * self.err .... function (err)
 *
 * === AMNA Code Layout ===
 *
 * amna.* === require('./lib/*')(amna);
 */
var amna = module.exports = {};
var fs = require('fs');

/**
 * Simple logging
 */
var log = function () {
    var args = Array.prototype.slice.apply(arguments).map(function (x) {
        return x && x.$repr ? x.$repr : x;
    });
    args.unshift('    AMNA ' + (new Date).toString() + '\n==>');
    console.info.apply(this, args);
};

/**
 * Error logging
 */
var pendingErrors;
var errorLog;
log.error = function () {
    var args = Array.prototype.slice.apply(arguments).map(function (x) {
        return x && x.$repr ? x.$repr : x.toString();
    });
    args.unshift('    AMNA ' + (new Date).toString() + '\n==>');
    var errBuffer = new Buffer(args.join(' ') + '\n\n', 'utf-8');

    /**
     * Connect to log first time it is used
     */
    if (!Array.isArray(pendingErrors)) {
        pendingErrors = [errBuffer];
        fs.createWriteStream(amna.$LOG_PATH, {flags: 'a'})
            .on('error', function (err) {
                log('Could not open log file', amna.$LOG_PATH);
            })
            .on('open', function () {
                log('Logging all errors to', this.path);
                errorLog = this;
                pendingErrors.map(this.write.bind(this));
                pendingErrors = [];
            });
    }

    /**
     * If log stream not yet ready, add err to pendingErrors
     */
    else {
        if (errorLog) {
            errorLog.write(errBuffer);
        }
        else {
            pendingErrors.push(errBuffer);
        }
    }
};

/**
 * Request-level logging
 */
log.request = function () {
    var args = Array.prototype.slice.apply(arguments);
    var req = args.shift();
    if (!req.$logId) {
        req.$logId = ((Math.random() + Math.random())/2).toString(36).replace('0.', '');
    }
    var info = '[' + [req.$logId, req.method, req.url].join(' ') + ']';
    args.unshift(info);
    log.apply(this, args);
    args.forEach(function (arg) {
        if (arg instanceof Error) {
            log.error(info, arg.stack);
        }
    });
};

/**
 * AMNA Library
 */
[
    '$express',
    'authentication',
    'collection',
    'controller',
    'err',
    'get',
    'interaction',
    'mongo',
    'refs',
    'registerModules',
    'registerServices',
    'registerThings',
    'responses',
    'route',
    'services',
    'set',
    'stack',
    'start',
    'static',
    'thing',
    'things',
    'types'
].map(function (name) {
    amna[name] = require('./lib/' + name)(amna, log);
});
