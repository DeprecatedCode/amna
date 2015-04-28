'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Collection
 */
var q = require('q');

module.exports = function (amna) {

    amna.mongoId = function (param) {
        return ':' + param + '([0-9a-f]{24})';
    };

    /**
     * Handle pagination and deleted records
     */
    amna.pageAndDeleteQuery = function (self) {
        var query = {};
        var qOpts = self.req.jsonQueryOptions;

        /**
         * Populate for collectionGet
         */
        if ('populate' in qOpts) {
            self.req.populate = qOpts.populate.map(function (pop) {
                return Array.isArray(pop) ? pop : [pop];
            });
            delete qOpts.populate;
        }

        /**
         * Check for allowed keys in JSON Query options
         */
        var defaultOptions = {'limit': 20, 'page': 1, 'deleted': false, 'sort': null};
        var keys = Object.keys(defaultOptions);
        Object.keys(qOpts).forEach(function (key) {
            if (keys.indexOf(key) === -1) { // key not allowed
                self.err('JSON query option \'.\' is not valid'.replace('.', key));
            }
            else if (qOpts[key] === undefined || qOpts[key] === null) {
                qOpts[key] = defaultOptions[key];
            }
            else if (typeof defaultOptions[key] === 'number' &&
                    (typeof qOpts[key] !== 'number' ||
                        qOpts[key] % 1 !== 0 ||
                        qOpts[key] < 0)
                ) {
                self.err('JSON query option \'.\' must be a positive integer'.replace('.', key));
            }
        });

        Object.keys(defaultOptions).forEach(function (key) {
            if (!qOpts.hasOwnProperty(key)) {
                qOpts[key] = defaultOptions[key];
            }
        });

        if (qOpts.page < 1) {
            self.err('JSON query option \'page\' must be greater than or equal to 1');
        }

        /**
         * Default: do not include deleted documents
         */
        if (qOpts.deleted === false) {
            query.deleted = {$ne: true};
        }

        /**
         * Show only deleted documents
         */
        else if (qOpts.deleted === true) {
            query.deleted = true;
        }

        return {
            query: query,
            options: {
                limit: qOpts.limit,
                skip: (qOpts.page - 1) * qOpts.limit,
                sort: qOpts.sort
            }
        };
    };

    var setupCollectionSchema = function (collection, options) {
        /**
         * GET /collection/schema
         */
        if (options.collectionGetSchema !== false) {
            collection.routes.collectionGetSchema = collection.collectionGet('/schema', function (self) {
                self.done(collection.thing.jsonSchema);
            });
        }
    };

    var setupCollectionAutocomplete = function (collection, options) {
        /**
         * GET /collection/autocomplete
         */
        if (options.collectionGetAutocomplete !== false) {
            collection.routes.collectionGetAutocomplete = collection.collectionGet('/autocomplete', function (self) {
                var info = amna.pageAndDeleteQuery(self);
                Object.keys(info.query).forEach(function (key) {
                    self.req.jsonQuery[key] = info.query[key];
                });
                collection.thing.autocomplete(self.req.jsonQuery, info.options, self.noerr(self.done));
            });
        }
    };

    var setupCollectionGet = function (collection, options) {
        /**
         * GET /collection
         */
        if (options.collectionGet !== false) {
            collection.routes.collectionGet = collection.collectionGet('', function (self) {
                if (self.value) {
                    return self.done(self.value);
                }
                var info = amna.pageAndDeleteQuery(self);
                Object.keys(info.query).forEach(function (key) {
                    self.req.jsonQuery[key] = info.query[key];
                });
                var query = collection.thing.find(self.req.jsonQuery, info.options);
                if (Array.isArray(self.req.populate)) {
                    self.req.populate.forEach(function (args) {
                        query.populate.apply(query, args);
                    });
                }
                query.exec(self.noerr(self.done));
            });
        }
    };

    var setupCollectionPost = function (collection, options) {
        /**
         * POST /collection
         */
        if (!options.readOnly && options.collectionPost !== false) {
            collection.routes.collectionPost = collection.collectionPost('', function (self) {
                var Model = collection.thing.model;

                var filter = function (data) {
                    /**
                     * Create blacklist
                     */
                    delete self.req.body._id;
                    delete self.req.body.__v;
                    delete self.req.body.updatedAt;
                    delete self.req.body.createdAt;
                    delete self.req.body.createdBy;

                    /**
                     * Add correct user
                     */
                    data.createdBy = self.req.user;
                }

                /**
                 * Handle POST [{...}, ...]
                 */
                if (Array.isArray(self.req.body)) {
                    q.all(self.req.body.map(function (data) {
                        var deferred = q.defer();
                        filter(data);
                        new Model(data).save(function (err, doc) {
                            deferred.resolve(
                                err ? amna.responses.error(err.message) : amna.responses.ok(doc)
                            );
                        });
                        return deferred.promise;
                    }))
                    .done(self.raw);
                }

                /**
                 * Handle POST {...}
                 */
                else {
                    var data = self.req.body;
                    filter(data);
                    new Model(data).save(self.noerr(self.done));
                }
            });
        }
    };

    var setupCollectionPut = function (collection, options) {
        /**
         * PUT /collection
         */
        if (!options.readOnly && options.collectionPut !== false) {
            collection.routes.collectionPut = collection.collectionPut('', function (self) {
                self.err('Not Implemented');
            });
        }
    };

    var setupCollectionDelete = function (collection, options) {
        /**
         * DELETE /collection
         */
        if (!options.readOnly && options.collectionDelete !== false) {
            collection.routes.collectionDelete = collection.collectionDelete('', function (self) {
                self.err('Not Implemented');
            });
        }
    };

    var setupDocumentGet = function (collection, options) {
        /**
         * GET /collection/:id
         */
        if (options.documentGet !== false) {
            collection.routes.documentGet = collection.documentGet('', function (self) {
                self.done(self.doc);
            });
        }
    };

    var setupDocumentPost = function (collection, options) {
        /**
         * POST /collection/:id
         */
        if (!options.readOnly && options.documentPost !== false) {
            collection.routes.documentPost = collection.documentPost('', function (self) {
                self.err('Not Implemented');
            });
        }
    };

    var setupDocumentPut = function (collection, options) {
        /**
         * PUT /collection/:id
         */
        if (!options.readOnly && options.documentPut !== false) {
            collection.routes.documentPut = collection.documentPut('', function (self) {
                /**
                 * Ensure that the user has access to the doc
                 */
                if (!self.permissionGranted &&
                    (!self.doc.createdBy || !self.req.user._id.equals(self.doc.createdBy))) {
                    return self.noaccess();
                }

                /**
                 * Update blacklist
                 */
                delete self.req.body._id;
                delete self.req.body.__v;
                delete self.req.body.updatedAt;
                delete self.req.body.createdAt;
                delete self.req.body.createdBy;

                /**
                 * Update the document
                 */
                Object.keys(self.req.body).forEach(function (key) {
                    self.doc[key] = self.req.body[key];
                });
                self.doc.updatedAt = Date.now()
                self.doc.save(self.noerr(self.done));
            });
        }
    };

    var setupDocumentDelete = function (collection, options) {
        /**
         * DELETE /collection/:id
         */
        if (!options.readOnly && options.documentDelete !== false) {
            collection.routes.documentDelete = collection.documentDelete('', function (self) {
                /**
                 * Ensure that the user has access to the document
                 */
                if (!self.permissionGranted &&
                    (!self.doc.createdBy || !self.req.user._id.equals(self.doc.createdBy))) {
                    return self.noaccess();
                }

                /**
                 * Delete the document
                 */
                self.doc.deleted = true;
                self.doc.save(self.noerr(self.done));
            });
        }
    }

    var Collection = function (thing, options) {
        if (!thing) {
            throw new Error('collection requires a thing');
        }

        if (!options || typeof options !== 'object') {
            options = {}
        }

        this.routes = {};
        this.thing = thing;
        this.controller = amna.controller();

        setupCollectionSchema(this, options);
        setupCollectionAutocomplete(this, options);
        setupCollectionGet(this, options);
        setupCollectionPost(this, options);
        setupCollectionPut(this, options);
        setupCollectionDelete(this, options);
        setupDocumentGet(this, options);
        setupDocumentPost(this, options);
        setupDocumentPut(this, options);
        setupDocumentDelete(this, options);
    };

    Collection.prototype.__defineGetter__('$repr', function () {
        return '<Collection ' + this.thing.$repr + '>';
    });

    ['Get', 'Post', 'Put', 'Delete'].forEach(function (name) {
        var method = name.toLowerCase();

        /**
         * Register authenticated and unauthenticated collection route methods
         */
        ['collection', 'unauthenticatedCollection'].forEach(function (realm) {
            Collection.prototype[realm + name] = function (url, handler) {
                var route = this.controller[method](url, function (self) {
                    /**
                     * Ensure that there is a user present for normal (as opposed to unauthenticated) routes
                     */
                    if (realm === 'collection' && !self.req.user) {
                        return self.noauth();
                    }

                    /**
                     * Run the mid stack
                     */
                    route.midStack.run(self, function () {
                        /**
                         * Continue with route handler
                         */
                        handler(self);
                    });

                });
                return route;
            };
        });

        /**
         * Register authenticated and unauthenticated document route methods
         */
        ['document', 'unauthenticatedDocument'].forEach(function (realm) {
            Collection.prototype[realm + name] = function (url, handler) {
                var route = this.controller[method]('/' + amna.mongoId('id') + url, function (self) {
                    /**
                     * Ensure that there is a user present for normal (as opposed to unauthenticated) routes
                     */
                    if (realm === 'document' && !self.req.user) {
                        return self.noauth();
                    }

                    this.thing.model.findById(self.params.id, self.noerr(function (doc) {
                        /**
                         * If no doc found
                         */
                        if (!doc) {
                            return self.notfound();
                        }

                        /**
                         * Add doc to the interaction
                         */
                        self.doc = doc;

                        /**
                         * Run the mid stack
                         */
                        route.midStack.run(self, function () {
                            /**
                             * Continue with route handler
                             */
                            handler(self);
                        });

                    }));
                }.bind(this));
                return route;
            };
        });
    });

    Collection.prototype.register = function register(prefix) {
        this.controller.register(prefix);
    };

    return function collection(thing, options) {
        return new Collection(thing, options);
    };
};
