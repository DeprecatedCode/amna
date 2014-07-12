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

/**
 * Simple logging
 */
var log = function () {
    var args = Array.prototype.slice.apply(arguments).map(function (x) {
        return x && x.$repr ? x.$repr : x;
    });
    args.unshift('AMNA ===>');
    console.info.apply(this, args);
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
    'refs',
    'registerModules',
    'registerServices',
    'registerThings',
    'route',
    'services',
    'set',
    'start',
    'static',
    'thing',
    'things',
    'types'
].map(function (name) {
    amna[name] = require('./lib/' + name)(amna, log);
});
