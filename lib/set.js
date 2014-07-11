/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Set
 */
module.exports = function (amna) {
    return function set () {
        var args = Array.prototype.slice.call(arguments);
        return amna.$express.set.apply(amna.$express, args);
    };
};
