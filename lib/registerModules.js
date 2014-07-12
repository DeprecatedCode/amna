/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Register Modules
 */
module.exports = function (amna, log) {

    amna.$MODULES_DIR = 'amna_modules';

    return function registerModules (path, modules) {

        if (typeof path !== 'string') {
            modules = path;
            path = '';
        }

        if (!Array.isArray(modules)) {
            throw new Error('amna.registerModules called without array of modules');
        }

        modules.forEach(function (mod) {

            var name;
            var modPath = path;

            if (typeof mod === 'string') {
                name = mod;
                modPath += '/' + name;
                mod = require([process.cwd(), amna.$MODULES_DIR, name, 'module'].join('/'));
            }

            if (typeof mod !== 'object' || typeof mod.register !== 'function') {
                name = name ? ': ' + name : (mod && mod.$name ? ': ' + mod.$name : '');
                throw new Error('amna.registerModules called with invalid module: ' + name);
            }

            mod.register(modPath);
            log('registered module', '<host>' + modPath, mod);
        });
    };
};
