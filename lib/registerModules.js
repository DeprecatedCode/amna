/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Register Modules
 */
module.exports = function (amna) {

    amna.$MODULES_DIR = 'amna_modules';

    return function registerModules (path, modules) {
        if (typeof path !== 'string') {
            modules = path;
            path = '.';
        }
        if (!Array.isArray(modules)) {
            throw new Error('amna.registerModules called without array of modules');
        }

        modules.forEach(function (module) {
            var name;
            if (typeof module === 'string') {
                name = module;
                module = require(path + '/' amna.$MODULES_DIR + '/' + name);
            }
            if (typeof module !== 'object' || typeof module.register !== 'function') {
                name = name ? ': ' + name : (module && module.$name ? ': ' + module.$name : '');
                throw new Error('amna.registerModules called with invalid module' + name);
            }
        });
    };
};
