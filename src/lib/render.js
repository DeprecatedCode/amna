'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Render
 */
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');

module.exports = function (amna, log) {
    return function render(filename, scope, callback) {
        fs.readFile(path.join(process.cwd(), filename), 'utf-8', function(err, data) {
            if(err) {
                callback(err);
            }
            else {
                callback(null, ejs.render(data, scope));
            }
        });
    };
};
