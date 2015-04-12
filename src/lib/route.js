'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Route
 */
module.exports = function (amna, log) {

    var Route = function Route(method, url, handler) {
        this.method = method;
        this.url = url;
        this.handler = handler;
        this.preStack = amna.stack();
        this.midStack = amna.stack();
        this.postStack = amna.stack();
    };

    Route.prototype.pre = function (handler) {
        this.preStack.push(handler);
    };

    Route.prototype.mid = function (handler) {
        this.midStack.push(handler);
    };

    Route.prototype.post = function (handler) {
        this.postStack.push(handler);
    };

    Route.prototype.run = function (interaction) {
        var route = this;

        /**
         * Record the last route used on the interaction
         */
        interaction.$route = route;

        /**
         * Run the preStack
         */
        route.preStack.run(interaction, function handler() {
            route.handler(interaction);
        });
    };

    Route.prototype.register = function (prefix) {
        var route = this;
        amna.$express[route.method](prefix + route.url, function (req, res, next) {
            /**
             * Create an Interaction with the postStack as the done()
             */
            var interaction = amna.interaction(req, res, next, function postStack(value) {
                interaction.value = value;

                /**
                 * If you call route.run from some other route, this will be the new route.run route.
                 */
                if (!interaction.$route) {
                    return interaction.err('No route.run(interaction) called on this interaction');
                }

                interaction.$route.postStack.run(interaction, function standardResponse() {
                    interaction.ok(interaction.value);
                });
            });

            route.run(interaction);
        });
        log('registered route', '      '.substr(0, 6 - this.method.length) +
            this.method.toUpperCase(), prefix + this.url);
    }

    return function route(method, url, handler) {
        return new Route(method, url, handler);
    };
};
