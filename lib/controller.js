/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Controller
 */
module.exports = function (amna, log) {

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
        return '<Controller ' + this.$routes.map(function (r, index) {
            if (index > 2) { return null; }
            if (index == 2) { return 'and ' + (this.$routes.length - 2) + ' more'; }
            return '"' + r.method.toUpperCase() + ' ' + r.url + '"';
        }.bind(this)).filter(function (x) { return x != null; }).join(' ') + '>';
    });

    Controller.prototype.register = function (prefix) {
        prefix = prefix || '';
        log.capture();
        this.$routes.map(function (route) {
            route.register(prefix);
        });
        log.flush('registered controller', prefix, this);
    };

    return function controller () {
        return new Controller();
    };
};
