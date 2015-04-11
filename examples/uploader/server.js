var amna = module.exports = require('../../src/index.js');
var fs = require('fs');

// npm isntall multer, node inspector
//var multer = require('multer');
//amna.$express.use(multer({ dest: process.cwd() + '/uploads'}));

amna.set('view engine', 'ejs');

amna.registerServices([]);
amna.registerThings(['Upload']);

var uploadController = amna.controller();

uploadController.get('/', function(self) {
    return self.render('index');
});

uploadController.post('/send', function(self) {
    //self.res.setHeader('Content-Type', 'text/html');
    //console.log('self is:' + self);
    //console.log('req is:' + self.req);

    var getFileName = function (str) {
        return str.split('\\').pop().split('/').pop();
    }

    var fileSize = JSON.stringify(self.req.files.uploadFile['size']);
    var fileType = JSON.stringify(self.req.files.uploadFile['mimetype']);
    var fileType = String(fileType);
    // console.log(fileType);
    // console.log(fileType == "\"image/jpeg\"");
    // console.log(fileSize);

    if (fileSize < 1500) {
        self.res.send('File is temp for not meeting filesize');
    } else if (fileType != "\"image/jpeg\"") {
        self.res.send('File is wrong type');
    } else {
        var fileName = (getFileName(self.req.files.uploadFile.path));
        var oldPath = self.req.files.uploadFile.path;
        // Make sure File/Filename does not exist in the target directory you are trying to move to
        var newPath = process.cwd() + '/public/images/' + fileName;
        fs.rename(oldPath, newPath, function(err) {
            if (err) {
                console.log('error on on file upload');
                console.log(err);
            }
        });

        //console.log(self.req.param('uploadMessageParam'));

        var upload = new amna.things.Upload.model({name: fileName});
        upload.save(function(err, result) {
            if (err) {
                return self.err(err);
            } else {
                return self.done(result);
            }
        });

        self.res.send('File was uploaded!');
    }

    var responseObj = fileName;
    //Response is not valid JSON
    //console.log(JSON.stringify(responseObj));
    //self.res.send(JSON.stringify(self.req.files.uploadFile['size']));
});

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

amna.registerModules([
    uploadController,
    amna.static(__dirname + '/public')
]);
