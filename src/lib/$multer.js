'use strict';

/**
 * Multer File Upload
 */
var multer = require('multer');

module.exports = function (amna) {

    /**
     * File upload capacity
     */
    amna.$express.use(multer({
        dest: process.cwd() + '/uploads'
    }));
};
