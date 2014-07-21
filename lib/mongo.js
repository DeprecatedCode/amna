/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Mongo
 */
var mongoose = require('mongoose');

module.exports = function (amna, log) {

    /**
     * Ensure requests fail until mongo is available
     */
    amna.$express.$errors.MongoDB = 'Not Connected';

    return {
        connect: function (mongo, next) {

            /**
             * Format mongo config object properly
             */
            mongo && typeof mongo === 'object' || (mongo = {});

            if (!Array.isArray(mongo.hosts)) {
                mongo.hosts = ['localhost'];
            }

            typeof mongo.db === 'string' || (mongo.db = 'amna-dev');

            var auth = mongo.username ? mongo.username + ':<password>@' : '';
            var url = mongo.hosts.map(function (x) {
                return 'mongodb://' + auth + x + '/' + mongo.db;
            }).join(',');

            log('connecting to database', url);

            /**
             * Substitute real password so it is not logged above
             */
            url = url.replace(/<password>/g, mongo.password);

            amna.$MongoDBUrl = url;

            /**
             * Connect to MongoDB
             */
            amna.$mongooseConnection = mongoose.connect(url, {/*options*/}, function(err) {
                if (err) { throw err; }

                /**
                 * Remove the general app blocking error
                 */
                delete amna.$express.$errors.MongoDB;

                typeof next === 'function' && next();
            });
        }
    };
};
