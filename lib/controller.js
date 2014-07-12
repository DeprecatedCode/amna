/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Controller
 */
module.exports = function (amna) {

    var Controller = function () {
        this.$routes = [];
    };

    /**
     * Add a route handler to the controller
     */
    ['get', 'post', 'put', 'delete'].map(function (method) {
        Controller.prototype[method] = function (url, handler) {
            var route = amna.route(method, url, handler);
            this.$routes.push(route);
            return route;
        };
    });

    Controller.prototype.__defineGetter__('$repr', function () {
        return '<Controller ' + this.$routes.map(function (r) {
            return '"' + r.method.toUpperCase() + ' ' + r.url + '"';
        }).join(' ') + '>';
    });

    Controller.prototype.register = function (prefix) {
        prefix = prefix || '';
        this.$routes.map(function (route) {
            route.register(prefix);
        });
    };

    return function controller () {
        return new Controller();
    };
};
