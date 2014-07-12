/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Thing
 */
var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate'),
    textSearch = require('mongoose-text-search');

module.exports = function (amna) {

    var Thing = function (schema) {
        this.schema = new mongoose.Schema(schema);
        this.schema.plugin(findOrCreate);
    };

    Thing.prototype.__defineGetter__('$repr', function () {
        return 'amna.things.' + this.name;
    });

    Thing.prototype.register = function (name) {
        this.name = name;
        this.model = mongoose.model(this.name, this.schema);
    };

    Thing.prototype.textSearch = function () {
        var args = Array.prototype.slice.apply(arguments);
        var textIndex = {};
        args.forEach(function (arg) {
            textIndex[arg] = 'text';
        });
        this.schema.plugin(textSearch);
        this.schema.index(textIndex);
    };

    return function (schema) {
        return new Thing(schema);
    };
};
