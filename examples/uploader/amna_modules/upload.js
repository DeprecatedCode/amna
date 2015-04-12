'use strict';

var amna = module.exports = require('../../../src/index.js');
var fs = require('fs');
var path = require('path');

var uploadController = module.exports = amna.controller();

/**
 * Render the home page
 */
uploadController.get('/', function(self) {
    return self.render('index');
});

/**
 * Upload an image
 */
uploadController.post('/send', function(self) {
    if (!self.req.files.uploadFile) {
        return self.err('No file uploaded', 400);
    }

    var fileSize = self.req.files.uploadFile['size'];
    var fileType = self.req.files.uploadFile['mimetype'];

    if (fileSize < 1500) {
        return self.err('Uploaded file is too small', 400);
    }

    if (fileSize > 150000) {
        return self.err('Uploaded file is too big', 400);
    }

    if (fileType != 'image/jpeg' && fileType != 'image/png') {
        return self.err('Uploaded file must be a jpeg or png image', 400);
    }

    var fileName = path.basename(self.req.files.uploadFile.path);
    var oldPath = self.req.files.uploadFile.path;
    var newPath = process.cwd() + '/public/images/' + fileName;
    fs.rename(oldPath, newPath, function(err) {
        if (err) {
            return self.err('Unable to move uploaded file');
        }

        var upload = new amna.things.Upload.model({name: fileName});
        upload.save(function(err, result) {
            if (err) {
                return self.err(err);
            } else {
                return self.done(result);
            }
        });
    });
});

/**
 * List all uploads
 */
uploadController.get('/uploads', function(self) {
    var query = {};
    amna.things.Upload.model.find(query, function(err, result) {
        if (err) {
            return self.err(err);
        } else {
            return self.done(result);
        }
    });
});

/**
 * Delete upload
 */
 uploadController.delete('/uploads/:id', function(self) {
    var id = self.params.id;
    amna.things.Upload.model.findById(id, function(err, result) {
        if (err) {
            return self.err(err);
        }

        var fileName = result.name;
        fs.unlink('public/images/' + fileName, function(err) {
            if (err) {
                return self.err(err);
            }

            amna.things.Upload.model.remove({_id: self.params.id}, function(err, result) {
                if (err) {
                    return self.err(err);
                }
                return self.done(result);
            });
        });
    });
 });
