/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Responses
 */
module.exports = function (amna, log) {
    return {
        ok: function (data) {
            return {status: 'ok', data: data};
        },
        error: function (msg) {
            return {status: 'error', reason: msg};
        }
    };
};
