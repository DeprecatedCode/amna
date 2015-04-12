'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - MongooseThing
 */
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var textSearch = require('mongoose-text-search');

module.exports = function (amna) {

    var MongooseThing = function MongooseThing(schema) {
        schema.deleted = Boolean;
        if (amna.createdByThing) {
            schema.createdBy = amna.types.Ref(amna.createdByThing);
        }
        schema.createdAt = {type: Date, default: Date.now};
        schema.updatedAt = {type: Date, default: Date.now};
        this.originalSchema = schema;
        this.schema = new mongoose.Schema(schema);
        this.schema.plugin(findOrCreate);

        /**
         * Global JSON transform
         */
        this.schema.methods.transformJSON = function (ret) {
            Object.keys(ret).forEach(function (key) {
                /**
                 * Convert Dates to UTC timestamps
                 */
                if (ret[key] && ret[key].getTime) {
                    ret[key] = ret[key].getTime();
                }
            });
        };

        this.schema.set('toJSON', {
            transform: function (doc, ret) {

                /**
                 * Include any available virtual (non-stored) data
                 */
                if (doc.$virtual) {
                    Object.keys(doc.$virtual).forEach(function (key) {
                        ret[key] = doc.$virtual[key];
                    });
                }

                /**
                 * Specific transformations
                 */
                doc.transformJSON(ret);
            }
        });

        /**
         * Always update updatedAt before saving
         */
        this.schema.pre('save', function (done) {
            this.updatedAt = Date.now();
            done();
        });

        /**
         * Empty set of virtual fields
         */
        this.virtual = {};
    };

    /**
     * Static method to encode JSON schema
     */
    MongooseThing.encodeJsonSchema = function (schema) {
        var json;

        if (schema && schema.ref) {
            return {type: 'reference', thing: schema.ref};
        }

        else if (schema && schema.type) {
            json = {};
            Object.keys(schema).forEach(function (key) {
                json[key] = schema[key];
            });
            var t = MongooseThing.encodeJsonSchema(schema.type);
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
            return schema.map(MongooseThing.encodeJsonSchema);
        }

        else if (schema && typeof schema === 'object') {
            json = {};
            Object.keys(schema).forEach(function (key) {
                json[key] = MongooseThing.encodeJsonSchema(schema[key]);
            });
            return json;
        }

        else {
            return schema;
        }
    };

    MongooseThing.prototype.__defineGetter__('jsonSchema', function () {
        return MongooseThing.encodeJsonSchema(this.originalSchema);
    });

    MongooseThing.prototype.__defineGetter__('$repr', function () {
        return 'amna.things.' + this.name;
    });

    MongooseThing.prototype.register = function (name) {
        this.name = name;
        this.model = mongoose.model(this.name, this.schema);
    };

    MongooseThing.prototype.textSearch = function () {
        var args = Array.prototype.slice.apply(arguments);
        var textIndex = {};
        args.forEach(function (arg) {
            textIndex[arg] = 'text';
        });
        this.schema.plugin(textSearch);
        this.schema.index(textIndex);
    };

    MongooseThing.prototype.autocompleteFields = function () {
        this.$autocompleteFields = Array.prototype.slice.apply(arguments);
    };

    RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    MongooseThing.prototype.find = function (query, options, done) {
        return this.model.find(query, null, options, done); // null is select
    };

    MongooseThing.prototype.findOne = function (query, options, done) {
        return this.model.findOne(query, null, options, done); // null is select
    };

    MongooseThing.prototype.findById = function (id, done) {
        return this.model.findById(id, done);
    };

    MongooseThing.prototype.autocomplete = function (query, options, done) {
        if (!query || typeof query !== 'object') {
            return done('autocomplete query must be an object');
        }
        if (typeof query.$input !== 'string') {
            return done('autocomplete query.$input must be a string');
        }
        if (!Array.isArray(this.$autocompleteFields)) {
            return done(this.name + ' does not support autocomplete');
        }

        var input = query.$input;
        delete query.$input;

        var autocompleteSearches = this.$autocompleteFields.map(function (key) {
            var q = {};
            q[key] = new RegExp('\\s' + RegExp.escape(input) + '|^' + RegExp.escape(input), 'i');
            return q;
        });

        return this.model.find({$and: [query, {$or: autocompleteSearches}]}, null, options, done);
    };

    return function (schema) {
        return new MongooseThing(schema);
    };
};
