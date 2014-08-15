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

    Route.prototype.run = function (interaction) {
        var route = this;
        /**
         * Run the preStack
         */
        route.preStack.run(interaction, function handler () {
            route.handler(interaction);
        });
    };

    Route.prototype.register = function (prefix) {
        var route = this;
        amna.$express[route.method](prefix + route.url, function (req, res, next) {
            /**
             * Create an Interaction with the postStack as the done()
             */
            var interaction = amna.interaction(req, res, next, function postStack (value) {
                interaction.value = value;
                route.postStack.run(interaction, function standardResponse () {
                    interaction.ok(interaction.value);
                });
            });

            route.run(interaction);
        });
        log('. registered route', this.method.toUpperCase(), prefix + this.url);
    }

    return function route (method, url, handler) {
        return new Route(method, url, handler);
    };
};
