/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Collection
 */
module.exports = function (amna, log) {

    amna.mongoId = function (param) {
        return ':' + param + '([0-9a-f]{24})';
    };

    var Collection = function (thing, options) {
        if (!thing) {
            throw new Error('collection requires a thing');
        }
        options && typeof options === 'object' || (options = {});

        this.routes = {};
        this.thing = thing;
        this.controller = amna.controller();

        this.routes.collectionGet = this.collectionGet('', function (self) {
            log('collectionGet', this.thing, self);
        });

        this.routes.collectionPost = this.collectionPost('', function (self) {
            log('collectionPost', this.thing, self);
        });

        this.routes.collectionPut = this.collectionPut('', function (self) {
            log('collectionPut', this.thing, self);
        });

        this.routes.collectionDelete = this.collectionDelete('', function (self) {
            log('collectionDelete', this.thing, self);
        });

        this.routes.documentGet = this.documentGet('', function (self) {
            log('documentGet', this.thing, self);
        });

        this.routes.documentPost = this.documentPost('', function (self) {
            log('documentPost', this.thing, self);
        });

        this.routes.documentPut = this.documentPut('', function (self) {
            log('documentPut', this.thing, self);
        });

        this.routes.documentDelete = this.documentDelete('', function (self) {
            log('documentDelete', this.thing, self);
        });
    };

    Collection.prototype.__defineGetter__('$repr', function () {
        return '<Collection ' + this.thing.$repr + '>';
    });

    ['Get', 'Post', 'Put', 'Delete'].forEach(function (name) {
        var method = name.toLowerCase();
        Collection.prototype['collection' + name] = function (url, handler) {
            return this.controller[method](url, handler);
        };
        Collection.prototype['document' + name] = function (url, handler) {
            return this.controller[method]('/' + amna.mongoId('id') + url, handler);
        };
    });

    Collection.prototype.register = function (prefix) {
        this.controller.register(prefix);
    };

    return function collection (thing, options) {
        return new Collection(thing, options);
    };
};
