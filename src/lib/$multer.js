'use strict';

/**
 * Multer File Upload
 */
var multer = require('multer');
var fs = require('fs');

module.exports = function (amna, log) {

    /**
     * File upload capacity
     */
    amna.$express.use(multer({ 
        dest: process.cwd() + '/uploads'
    }));
};
