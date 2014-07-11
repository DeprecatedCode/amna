/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Route
 */
module.exports = function (amna) {

    var Route = function (method, url, handler) {
        this.method = method;
        this.url = url;
        this.handler = handler;
    };

    Route.prototype.register = function (prefix) {
        amna.$express[this.method](prefix + this.url, function (req, res, next) {
            var interaction = amna.interaction(req, res, next);
            this.handler(interaction);
        });
    }

    return function route (method, url, handler) {
        return new Route(method, url, handler);
    };
};
