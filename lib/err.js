'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Err
 * Throw a severe client error.
 */
module.exports = function (amna, log) {
    return function err(reason, status) {
        var e = new Error('AMNAError');
        e.reason = reason;
        e.status = status || 500;
        log('AMNAError', reason, 'HTTP ' + e.status);
        throw e;
    };
};
