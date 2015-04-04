var amna = module.exports = require('../../src/index.js');

amna.set('view engine', 'ejs');

amna.registerServices([]);
amna.registerThings(['Message']);

var chatController = amna.controller();
chatController.get('/', function(self) {
    return self.render('index');
});

chatController.post('/send', function(self) {
    var message = new amna.things.Message.model(self.req.body.message);
    message.save(function(err, result) {
        if (err) {
            return self.err(err);
        } else {
            return self.done(result);
        }
    });
});

chatController.get('/messages', function(self) {
    var query = {};
    if (self.req.query.after) {
        query = {createdAt: {$gt: self.req.query.after}};
    }
    amna.things.Message.model.find(query, function(err, result) {
        if (err) {
            return self.err(err);
        } else {
            return self.done(result);
        }
    });
});

amna.registerModules([
    chatController,
    amna.static(__dirname + '/public')
]);
