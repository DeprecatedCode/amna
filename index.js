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
    'models',
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
    'types'
].map(function (name) {
    amna[name] = require('./lib/' + name)(amna);
});
