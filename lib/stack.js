/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Stack
 */
module.exports = function (amna, log) {

    var Stack = function Stack () {
        this.stack = [];
    };

    Stack.prototype.push = function (fn) {
        if (typeof fn !== 'function') {
            throw new Error('Only functions may be pushed onto a Stack');
        }
        this.stack.push(fn);
    };

    Stack.prototype.run = function (scope, next) {
        var currentStack = Array.prototype.slice.apply(this.stack);
        var advance = function () {
            /**
             * Still more functions on the stack to process
             */
            if (currentStack.length) {
                var fn = currentStack.shift();
                fn(scope, function done (err, value) {
                    if (err) {
                        return scope.err(err);
                    }
                    if (value !== undefined) {
                        scope.value = value;
                    }
                    advance();
                });
            }

            else {
                next(); // Done with the entire stack
            }
        };
        advance();
    };

    return function () {
        return new Stack();
    };
};
