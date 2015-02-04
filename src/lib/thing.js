'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Thing
 */
module.exports = function (amna) {
    return {
        mongoose: require('./thing-mongoose')(amna)
    };
};
