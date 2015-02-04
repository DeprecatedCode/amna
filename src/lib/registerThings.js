'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Register Things
 */
module.exports = function (amna, log) {

    amna.$THINGS_DIR = 'amna_things';

    return function registerThings(things) {
        var path = process.cwd();

        if (!Array.isArray(things)) {
            throw new Error('amna.registerThings called without array of thing names');
        }

        things.forEach(function (name) {

            if (typeof name !== 'string') {
                throw new Error('amna.registerThings called with array of thing names containing a non-string element');
            }

            amna.refs[name] = amna.types.Ref(name);
        });

        things.forEach(function (name) {

            var thing = require([path, amna.$THINGS_DIR, name.toLowerCase()].join('/'));
            amna.things[name] = thing;

            thing.register(name);
            log('registered thing', thing);
        });
    };
};
