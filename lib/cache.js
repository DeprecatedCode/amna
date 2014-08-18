/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Cache
 *
 * [TEMPORARY] Using mongo to store cached data,
 *             eventually this should be configurable.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var parseDuration = require('parse-duration');

module.exports = function phase_1 (amna, log) {

    var AMNACache = amna.thing({
        key: {
            type: String,
            unique: true,
            required: true
        },
        value: {
            type: amna.types.Mixed
        }
    });

    AMNACache.register('amna_cache');
    log('registered thing', 'amna_cache');

    var CacheRecord = function (key) {
        this.key = key;
    };

    CacheRecord.prototype.read = function (maxage, done) {
        if (typeof maxage === 'function') {
            done = maxage;
            maxage = Infinity;
        }
        else if (typeof maxage === 'string') {
            maxage = parseDuration(maxage);
        }
        log('<init> read key', this.key);
        AMNACache.model.findOne({key: this.key}, function (err, doc) {
            if (err) {
                return done(err);
            }
            else {
                if (new Date - doc.updatedAt > maxage) {
                    log('<timeout> read key', this.key, new Date - doc.updatedAt, '>', maxage);
                    return done(null, null); // Cache is too old
                }
                log('<success> read key', this.key);
                return done(null, doc.value);
            }
        }.bind(this));
    };

    CacheRecord.prototype.save = function (value, done) {
        log('<init> save key', this.key);
        var record = {key: this.key, value: value};
        AMNACache.model.findOrCreate({key: this.key}, record, function (err, doc) {
            if (err) {
                log('<fail> save key', this.key, err);
                return done(err);
            }
            doc.value = value;
            doc.markModified('value');
            doc.save(function (err) {
                if (err) {
                    log('<fail> save key', this.key, err);
                    return done(err);
                }
                log('<success> save key', this.key);
                done(null, doc.value);
            }.bind(this));
        }.bind(this));
    };

    /**
     * Usage:
     *
     * amna.cache(some, key, args).read(function (err, record) { ... });
     * amna.cache(some, key, args).save(value, function (err, record) { ... });
     */
    return function (/* cache key arguments */) {
        var hash = crypto.createHash('sha1');
        Array.prototype.forEach.call(arguments, function (arg) {
            /**
             * This is to prevent two different keys hashing to the same value,
             * such as the string "[]" and the array [].
             * This way the first produces '["[]"]' and the second produces '[[]]'.
             */
            hash.update(JSON.stringify([arg]));
        });
        var key = hash.digest('base64');
        return new CacheRecord(key);
    };
};
