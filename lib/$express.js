'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Express App
 */
var express = require('express');
var partials = require('express-partials');
var bodyParser = require('body-parser');

module.exports = function (amna, log) {
    var app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.$errors = {};

    /**
     * Log all requests
     */
    app.use(function (req, res, next) {
        log.request(req, 'New request from', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        next();
    });

    /**
     * Allow any module to stop all requests with a 503 service unavailable response
     */
    app.use(function (req, res, next) {
        var errs = Object.keys(app.$errors).filter(function (key) {
            return app.$errors[key];
        }).map(function (key) {
            return {key: key, message: app.$errors[key]};
        });
        if (errs.length) {
            amna.err(errs, 503);
        }
        else {
            next();
        }
    });

    /**
     * Parse JSON from query string
     */
    app.use(function (req, res, next) {
        var query = decodeURIComponent(req._parsedUrl.query);
        if (typeof query === 'string' && query.length && (query[0] === '{' || query[0] === '[')) {
            try {
                query = JSON.parse(query);
            }
            catch (e) {
                amna.err('Malformed query JSON', 400);
            }

            if (Array.isArray(query)) {
                if (query.length !== 2) {
                    amna.err('JSON query array must contain exactly two elements: [query, options]', 400);
                }
                [0, 1].map(function (idx) {
                    if (!query[idx] || typeof query[idx] !== 'object' || Array.isArray(query[idx])) {
                        amna.err('\'' + {0: 'query', 1: 'options'}[idx] +
                            '\' element in JSON query array [query, options] must be an object', 400);
                    }
                });

                req.jsonQuery = req.requiredJsonQuery = query[0];
                req.jsonQueryOptions = query[1];
            }

            else {
                req.jsonQuery = req.requiredJsonQuery = query;
                req.jsonQueryOptions = {};
            }

            return next();
        }

        req.jsonQuery = {}; // Sensible default so routes don't have to check if this exists
        req.jsonQueryOptions = {};

        /**
         * In case a route asks for requiredJsonQuery that is not present
         */
        req.__defineGetter__('requiredJsonQuery', function () {
            amna.err('Missing query JSON object in URL: ?{}', 400);
        });

        next();
    });

    /**
     * Enable express partials and layouts
     */
    app.use(partials());

    return app;
};
