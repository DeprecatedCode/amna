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
var logCapture = [];
var log = function () {
    var args = Array.prototype.slice.apply(arguments).map(function (x) {
        return x && x.$repr ? x.$repr : x;
    });
    if (logCapture.length) {
        args.unshift('...');
        return logCapture[logCapture.length - 1].push(args);
    }
    if (args[0] === '...') {
        args.unshift('  >');
    }

    else {
        args.unshift('    AMNA ' + (new Date).toString() + '\n==>');
    }
    console.info.apply(this, args);
};

/**
 * Capture related logs
 */
log.capture = function () {
    logCapture.push([]);
};

/**
 * Flush related logs
 */
log.flush = function () {
    var logs = logCapture.pop();
    log.apply(this, arguments);
    logs.map(function (lg) {
        log.apply(this, lg)
    });
};

/**
 * Log in module
 */
log.module = function (name) {
    var mod = function (fn) {
        return function () {
            var args = Array.prototype.slice.apply(arguments);
            args.unshift('[' + name + ']');
            return fn.apply(this, args);
        };
    };
    var _log = mod(log);
    _log.capture = log.capture;
    _log.flush = mod(log.flush);
    _log.error = mod(log.error);
    _log.request = mod(log.request);
    return _log;
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
    var name = args.shift();
    var req = args.shift();
    if (!req.$logId) {
        req.$logId = ((Math.random() + Math.random())/2).toString(36).replace('0.', '');
    }
    var info = '[' + [req.$logId, req.method, req.url].join(' ') + ']';
    args.unshift(info);
    args.unshift(name);
    log.apply(this, args);
    args.forEach(function (arg) {
        if (arg instanceof Error) {
            err = '';
            if (arg.reason) {
                err = 'Reason: ' + JSON.stringify(arg.reason) + ' ';
            }
            log.error(info, err + arg.stack);
        }
    });
};

/**
 * Allow modules to control loading phase
 */
var phases = [];

/**
 * AMNA Library
 */
[
    '$express',
    'authentication',
    'cache',
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
    var mod = require('./lib/' + name);
    if (typeof mod !== 'function') {
        throw new Error('AMNA lib must be a function: ' + name);
    }
    var phase = mod.name.match(/^phase_(\d)+$/)
    phase = phase ? phase.pop() : 0;
    phases[phase] || (phases[phase] = []);
    phases[phase].push({name: name, fn: mod});
});

/**
 * Load phase-marked modules
 */
phases.forEach(function (mods, phase) {
    if (!Array.isArray(mods)) {
        return;
    }
    log.capture();
    mods && mods.forEach && mods.forEach(function (mod) {
        amna[mod.name] = mod.fn(amna, log.module(mod.name));
        log(mod.name);
    });
    log.flush('Phase ' + phase + ' libraries loaded');
});
