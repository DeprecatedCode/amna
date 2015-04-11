'use strict';

/**
 *
 */
var multer = require('multer');
var fs = require('fs');

module.exports = function (amna, log) {

    /**
     * File upload capacity
     */
    amna.$express.use(multer({ 
        dest: process.cwd() + '/uploads',
        // limits: {
        //     fileSize: 2000
        // },
        // onFileSizeLimit: function (file) {
        //     console.log('Failed: ', file.originalname)
        //     fs.unlink('./' + file.path) // delete the partially written file
        // }
    }));
};
