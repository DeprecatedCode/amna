/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Route
 */
module.exports = function (amna, log) {

    var Route = function Route (method, url, handler) {
        this.method = method;
        this.url = url;
        this.handler = handler;
        this.preStack = amna.stack();
        this.postStack = amna.stack();
    };

    Route.prototype.pre = function (handler) {
        this.preStack.push(handler);
    };

    Route.prototype.post = function (handler) {
        this.postStack.push(handler);
    };

    Route.prototype.register = function (prefix) {
        amna.$express[this.method](prefix + this.url, function (req, res, next) {
            var interaction = amna.interaction(req, res, next);
            this.preStack.run(interaction, function handler () {
                this.handler(interaction, function postStack () {
                    this.postStack.run(interaction, function standardResponse () {
                        res.json(200, amna.responses.ok(interaction.value));
                    });
                });
            });
        });
        log('. registered route', this.method.toUpperCase(), prefix + this.url);
    }

    return function route (method, url, handler) {
        return new Route(method, url, handler);
    };
};
