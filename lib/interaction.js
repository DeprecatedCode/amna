/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Interaction
 */
module.exports = function (amna) {

    var Interaction = function (req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.scope = {};
    };

    /**
     * Successful response to the client
     */
    Interaction.prototype.ok = function (data) {
        this.res.json(200, {status: 'ok', data: data});
    };

    /**
     * Cause an error to be triggered
     */
    Interaction.prototype.err = function (reason, code) {
        code = code || 400;
        console.error('[1] HTTP ' + code, reason);
        amna.err(reason, code);
    };

    /**
     * Send all errors to the route error handler, so that
     * the flow continues only when there is no error.
     */
    Interaction.prototype.noerr = function (callback) {
        return function (err, value) {
            if (err) { return this.err(err); }
            callback(value);
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
        this.res.json(200, data);
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
                res.writeHead(302, {
                    Location: proxyRes.redirects[0]
                });
                res.end();
            }

            /**
             * Pipe stream to user
             */
            else {
                stream.pipe(res);
            }
        });
    };

    return function interaction(req, res, next) {
        return new Interaction(req, res, next);
    };
};
