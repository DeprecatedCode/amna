/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Get
 */
module.exports = function (amna) {
    return function get () {
        var args = Array.prototype.slice.call(arguments);
        return amna.$express.get.apply(amna.$express, args);
    };
};
