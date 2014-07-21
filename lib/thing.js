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
        schema.deleted = Boolean;
        if (amna.createdByThing) {
            schema.createdBy = amna.types.Ref(amna.createdByThing);
        }
        schema.createdAt = {type: Date, default: Date.now};
        schema.updatedAt = {type: Date, default: Date.now};
        this.originalSchema = schema;
        this.schema = new mongoose.Schema(schema);
        this.schema.plugin(findOrCreate);
    };

    Thing.encodeJsonSchema = function (schema) {

        if (schema && schema.ref) {
            return {type: 'reference', thing: schema.ref};
        }

        else if (schema && schema.type) {
            var json = {};
            Object.keys(schema).forEach(function (key) {
                json[key] = schema[key];
            });
            var t = Thing.encodeJsonSchema(schema.type);
            Object.keys(t).forEach(function (key) {
                json[key] = t[key];
            });
            return json;
        }

        else if (schema === Boolean) {
            return {type: 'boolean'};
        }

        else if (schema === String) {
            return {type: 'string'};
        }

        else if (schema === Number) {
            return {type: 'number'};
        }

        else if (schema === Date) {
            return {type: 'date'};
        }

        else if (Array.isArray(schema)) {
            return schema.map(Thing.encodeJsonSchema);
        }

        else if (schema && typeof schema === 'object') {
            var json = {};
            Object.keys(schema).forEach(function (key) {
                json[key] = Thing.encodeJsonSchema(schema[key]);
            });
            return json;
        }

        else {
            return schema;
        }
    };

    Thing.prototype.__defineGetter__('jsonSchema', function () {
        return Thing.encodeJsonSchema(this.originalSchema);
    });

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
