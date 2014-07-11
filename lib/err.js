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
    return function err (reason) {
        var e = new Error('An error occurred');
        e.reason = reason;
        e.status = 400;
        throw e;
    };
};
