/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Interaction
 */
module.exports = function (amna, log) {

    var Interaction = function (req, res, next, done) {
        this.req = req;
        this.res = res;
        this.params = req.params;

        /**
         * Do not use this handler, and skip to next available handler.
         * Useful for having multiple handlers on the same route.
         */
        this.skip = function () {
            next();
        };

        /**
         * To pass a value further along the stack
         */
        if (typeof done !== 'function') {
            throw new Error('done must be a function');
        }

        this.$whenDone = [];
        this.$done = done;

        /**
         * Setup view scope
         */
        this.scope = {
            user: req.user,
            jsonQuery: req.jsonQuery
        };
    };

    /**
     * Function to invoke after this.done()
     */
    Interaction.prototype.whenDone = function (fn) {
        if (typeof fn !== 'function') {
            throw new Error('whenDone(...) argument must be a function');
        }
        this.$whenDone.push(fn);
    };

    /**
     * Done
     */
    Interaction.prototype.done = function () {
        var args = Array.prototype.slice.apply(arguments);
        if (!this.$done) {
            console.log(this);
        }
        this.$done.apply(this, args);
        this.$whenDone.map(function (x) {
            x.apply(this, args);
        }.bind(this));
    };

    /**
     * Successful response to the client
     */
    Interaction.prototype.ok = function (data) {
        log.request(this.req, 'HTTP', 200, 'JSON Response');
        this.res.status(200).json(amna.responses.ok(data));
    };

    /**
     * Cause an error to be triggered
     */
    Interaction.prototype.err = function (reason, status) {
        try {
            amna.err(reason, status);
        }
        catch (err) {
            this.res.status(err.status).json(amna.responses.error(err.reason));
        }
    };

    /**
     * Render a view
     */
    Interaction.prototype.render = function (view, extras) {
        extras && typeof extras === object && Object.keys(extras).forEach(function (key) {
            this.scope[key] = extras[key];
        });
        log.request(this.req, 'HTTP', 200, 'Render view:', view);
        return this.res.render(view, this.scope);
    };

    /**
     * Send all errors to the route error handler, so that
     * the flow continues only when there is no error.
     */
    Interaction.prototype.noerr = function (callback) {
        return function (err, value) {
            if (err) { return this.err(err); }
            callback.bind(this)(value);
        }.bind(this);
    };

    /**
     * Standard Not Authenticated Error
     */
    Interaction.prototype.noauth = function (msg) {
        this.err(msg || 'Not Authenticated', 401);
    };

    /**
     * Standard Access Denied Error
     */
    Interaction.prototype.noaccess = function (msg) {
        this.err(msg || 'Access Denied', 403);
    };

    /**
     * Standard Not Found Error
     */
    Interaction.prototype.notfound = function (msg) {
        this.err(msg || 'Not Found', 404);
    };

    /**
     * Send unwrapped JSON data to the client
     */
    Interaction.prototype.raw = function (data) {
        log.request(this.req, 'HTTP', 200, 'Raw JSON Response');
        this.res.json(200, data);
    };

    /**
     * Redirect
     */
    Interaction.prototype.redirect = function (url) {
        this.res.writeHead(302, {
            Location: url
        });
        log.request(this.req, 'HTTP', 302, 'Redirect', url);
        this.res.end();
    };

    /**
     * Proxy from an upstream
     */
    Interaction.prototype.proxy = function (stream) {
        stream.end(function (err, proxyRes) {
            /**
             * Handle redirects
             */
            if (proxyRes.redirects && proxyRes.redirects.length) {
                this.redirect(proxyRes.redirects[0]);
            }

            /**
             * Pipe stream to user
             */
            else {
                log.request(this.req, 'HTTP', 'Proxied response');
                stream.pipe(this.res);
            }
        }.bind(this));
    };

    return function interaction(req, res, next, done) {
        return new Interaction(req, res, next, done);
    };
};
