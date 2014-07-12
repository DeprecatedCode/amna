/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Register Services
 */
module.exports = function (amna, log) {

    amna.$SERVICES_DIR = 'amna_services';

    return function registerServices (services) {
            var path = process.cwd();

        if (!Array.isArray(services)) {
            throw new Error('amna.registerServices called without array of service names');
        }

        services.forEach(function (name) {

            var service = require([path, amna.$SERVICES_DIR, name].join('/'));
            amna.services[name] = service;
            log('registered service', 'amna.services.' + name);
        });
    };
};
