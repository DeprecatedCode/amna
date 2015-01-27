'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Static
 */
var express = require('express');

module.exports = function (amna) {
    return function (path) {
        return {
            $repr: '<Static "' + path + '">',
            register: function (prefix) {
                amna.$express.use(prefix, express.static(path));
            }
        };
    };
};
