'use strict';

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
var crypto = require('crypto');
var parseDuration = require('parse-duration');

module.exports = function phase_1(amna, log) {

    var AMNACache = amna.thing.mongoose({
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

    CacheRecord.prototype.decayingSet = function () {
        return new DecayingSetCacheRecord(this.key);
    };

    CacheRecord.prototype.read = function (maxage, done, full) {
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
            else if (!doc) {
                return done(null, null);
            }
            else {
                var now = new Date();
                if (now - doc.updatedAt > maxage) {
                    log('<timeout> read key', this.key, now - doc.updatedAt, '>', maxage);
                    return done(null, null); // Cache is too old
                }
                log('<success> read key', this.key);
                return done(null, full ? doc : doc.value);
            }
        }.bind(this));
    };

    CacheRecord.prototype.save = function (value, done, full) {
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
                done(null, full ? doc : doc.value);
            }.bind(this));
        }.bind(this));
    };

    var DecayingSetCacheRecord = function (key) {
        this.key = key;
    };

    DecayingSetCacheRecord.prototype.read = function (maxage, done, full) {
        if (typeof maxage === 'function') {
            done = maxage;
            maxage = Infinity;
        }
        else if (typeof maxage === 'string') {
            maxage = parseDuration(maxage);
        }
        log('<init> read decaying set key', this.key);
        AMNACache.model.findOne({key: this.key}, function (err, doc) {
            if (err) {
                return done(err);
            }
            else if (!doc) {
                return done(null, null);
            }
            else {
                if (!Array.isArray(doc.value)) {
                    doc.value = [];
                }
                var now = new Date();
                doc.value = doc.value.filter(function (item) {
                    return now - item.updatedAt <= maxage;
                });
                log('<success> read decaying set key', this.key);
                return done(null, full ? doc : doc.value);
            }
        }.bind(this));
    };

    DecayingSetCacheRecord.prototype.save = function (value, done, full) {
        /**
         * Ensure value can be stored in JSON before continuing
         */
        JSON.stringify(value);

        log('<init> save decaying set key', this.key);
        var record = {key: this.key, value: []};
        AMNACache.model.findOrCreate({key: this.key}, record, function (err, doc) {
            if (err) {
                log('<fail> save decaying set key', this.key, err);
                return done(err);
            }

            if (!Array.isArray(doc.value)) {
                doc.value = [];
            }

            var existing = doc.value.filter(function (item) {
                return JSON.stringify(item.value) === JSON.stringify(value);
            }).pop();

            if (existing) {
                existing.updatedAt = new Date();
            }

            else {
                doc.value.push({
                    updatedAt: new Date(),
                    value: value
                });
            }

            doc.markModified('value');
            doc.save(function (err) {
                if (err) {
                    log('<fail> save decaying set key', this.key, err);
                    return done(err);
                }
                log('<success> save decaying set key', this.key);
                done(null, full ? doc : doc.value);
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
