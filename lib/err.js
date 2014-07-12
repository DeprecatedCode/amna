/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Err
 * Throw a severe client error.
 */
module.exports = function (amna) {
    return function err (reason, status) {
        var e = new Error('AMNAError');
        e.reason = reason;
        e.status = status || 400;
        throw e;
    };
};
