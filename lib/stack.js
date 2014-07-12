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

    Stack.prototype.run = function () {
        console.log("RUNNING STACK");
    };

    return function () {
        return new Stack();
    };
};
