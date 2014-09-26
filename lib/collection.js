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

    /**
     * Handle pagination and deleted records
     */
    var pageAndDeleteQuery = function (self) {
        var query = {};
        var qOpts = self.req.jsonQueryOptions;

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

    var Collection = function (thing, options) {
        if (!thing) {
            throw new Error('collection requires a thing');
        }

        options && typeof options === 'object' || (options = {});

        this.routes = {};
        this.thing = thing;
        this.controller = amna.controller();

        /**
         * GET /collection/schema
         */
        this.routes.collectionGetSchema = this.collectionGet('/schema', function (self) {
            self.done(this.thing.jsonSchema);
        }.bind(this));

        /**
         * GET /collection/autocomplete
         */
        this.routes.collectionGetAutocomplete = this.collectionGet('/autocomplete', function (self) {
            var info = pageAndDeleteQuery(self);
            Object.keys(info.query).forEach(function (key) {
                self.req.jsonQuery[key] = info.query[key];
            });
            this.thing.autocomplete(self.req.jsonQuery, info.options, self.noerr(self.done));
        }.bind(this));

        /**
         * GET /collection
         */
        this.routes.collectionGet = this.collectionGet('', function (self) {
            if (self.value) {
                return self.done(self.value);
            }
            var info = pageAndDeleteQuery(self);
            Object.keys(info.query).forEach(function (key) {
                self.req.jsonQuery[key] = info.query[key];
            });
            var query = this.thing.find(self.req.jsonQuery, info.options);
            if (Array.isArray(self.req.populate)) {
                self.req.populate.forEach(function (args) {
                    query.populate.apply(query, args);
                });
            }
            query.exec(self.noerr(self.done));
        }.bind(this));

        /**
         * POST /collection
         */
        this.routes.collectionPost = this.collectionPost('', function (self) {
            var model = this.thing.model;

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
            if(Array.isArray(self.req.body)) {
                q.all(self.req.body.map(function (data) {
                    var deferred = q.defer();
                    filter(data);
                    new model(data).save(function (err, doc) {
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
                new model(data).save(self.noerr(self.done));
            }
        }.bind(this));

        /**
         * PUT /collection
         */
        this.routes.collectionPut = this.collectionPut('', function (self) {
            self.err('Not Implemented');
        }.bind(this));

        /**
         * DELETE /collection
         */
        this.routes.collectionDelete = this.collectionDelete('', function (self) {
            self.err('Not Implemented');
        }.bind(this));

        /**
         * GET /collection/:id
         */
        this.routes.documentGet = this.documentGet('', function (self) {
            self.done(self.doc);
        }.bind(this));

        /**
         * POST /collection/:id
         */
        this.routes.documentPost = this.documentPost('', function (self) {
            self.err('Not Implemented');
        }.bind(this));

        /**
         * PUT /collection/:id
         */
        this.routes.documentPut = this.documentPut('', function (self) {
            /**
             * Ensure that the user has access to the doc
             */
            if (!self.doc.createdBy || !self.req.user._id.equals(self.doc.createdBy)) {
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
        }.bind(this));

        /**
         * DELETE /collection/:id
         */
        this.routes.documentDelete = this.documentDelete('', function (self) {
            /**
             * Ensure that the user has access to the document
             */
            if (!self.doc.createdBy || !self.req.user._id.equals(self.doc.createdBy)) {
                return self.noaccess();
            }

            /**
             * Delete the document
             */
            self.doc.deleted = true;
            self.doc.save(self.noerr(self.done));
        }.bind(this));
    };

    Collection.prototype.__defineGetter__('$repr', function () {
        return '<Collection ' + this.thing.$repr + '>';
    });

    ['Get', 'Post', 'Put', 'Delete'].forEach(function (name) {
        var method = name.toLowerCase();
        Collection.prototype['collection' + name] = function (url, handler) {
            return this.controller[method](url, function (self) {
                if (!self.req.user) {
                    return self.noauth();
                }
                handler(self);
            });
        };
        Collection.prototype['document' + name] = function (url, handler) {
            return this.controller[method]('/' + amna.mongoId('id') + url, function (self) {

                if (!self.req.user) {
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
                     * Continue with route handler
                     */
                    handler(self, doc /* DEPRECATE THIS SOON */);
                }));
            }.bind(this));
        };
    });

    Collection.prototype.register = function (prefix) {
        this.controller.register(prefix);
    };

    return function collection (thing, options) {
        return new Collection(thing, options);
    };
};
