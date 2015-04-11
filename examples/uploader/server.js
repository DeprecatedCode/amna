'use strict';

var amna = module.exports = require('../../src/index.js');

amna.set('view engine', 'ejs');

amna.registerServices([]);
amna.registerThings(['Upload']);

amna.registerModules([
    require('./amna_modules/upload.js'),
    amna.static(__dirname + '/public')
]);
