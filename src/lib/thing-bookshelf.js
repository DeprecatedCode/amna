'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - BookshelfThing
 */
var bookshelf = require('bookshelf');

module.exports = function (amna) {

    var BookshelfThing = function BookshelfThing(config) {
        this.model = amna.$bookshelf.Model.extend(config);
    };

    return function (config) {
        return new BookshelfThing(config);
    };
};
