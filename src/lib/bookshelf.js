'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Bookshelf
 * Connect to SQL-based databases.
 */
var knex = require('knex');
var bookshelf = require('bookshelf');

module.exports = function (amna, log) {

    return function (connection) {
        amna.$knex = knex(connection);
        amna.$bookshelf = bookshelf(amna.$knex);
    };
};
