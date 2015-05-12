'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Types
 */
var mongoose = require('mongoose');
var mongooseTypes = require('mongoose-types');

mongooseTypes.loadTypes(mongoose);

module.exports = function () {
    return {
        ObjectId: mongoose.Types.ObjectId,
        Mixed: mongoose.SchemaTypes.Mixed,
        Email: mongoose.SchemaTypes.Email,
        Url: mongoose.SchemaTypes.Url,
        Ref: function MongoDocumentReference(name) {
            return {type: mongoose.Schema.ObjectId, ref: name};
        },
        GeoPoint: {type: [Number], index: '2dsphere'}
    };
};
