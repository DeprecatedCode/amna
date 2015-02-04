'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Authentication
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function (amna, log) {

    var queryJSON = function (data) {
        return '?' + encodeURIComponent(JSON.stringify(data));
    };

    var defaults = function () {
        if (!amna.authentication.urls) {
            amna.authentication.urls = {};
        }

        if (!amna.authentication.urls.auth) {
            amna.authentication.urls.auth = '/';
        }

        if (!amna.authentication.urls.deauth) {
            amna.authentication.urls.deauth = '/';
        }

        if (!amna.authentication.urls.authSuccess) {
            amna.authentication.urls.authSuccess = '/';
        }

        if (!amna.authentication.urls.authFailure) {
            amna.authentication.urls.authFailure = '/';
        }

        if (!amna.authentication.urls.deauthSuccess) {
            amna.authentication.urls.deauthSuccess = '/';
        }
    };

    var setupAuth = function () {
        if (amna.authentication.serializeUser) {
            passport.serializeUser(amna.authentication.serializeUser);
        }

        if (amna.authentication.deserializeUser) {
            passport.deserializeUser(amna.authentication.deserializeUser);
        }

        if (amna.authentication.facebook) {
            require('./authentication-facebook')(amna, passport);
        }

        if (amna.authentication.google) {
            require('./authentication-google')(amna, passport);
        }

        if (amna.authentication.local) {
            if (typeof amna.authentication.local !== 'function') {
                throw new Error('amna.authentication.local must be a function');
            }
            passport.use(new LocalStrategy(amna.authentication.local));
        }
    };

    /**
     * Called during amna.start()
     */
    amna.$auth = function (done) {
        defaults();
        setupAuth();

        amna.$express.use(session({
            resave: true,
            saveUninitialized: true,
            secret: amna.$express.get('secret'),
            store: new MongoStore({
                mongoose_connection: amna.$mongooseConnection.connections[0]
            }, function () {
                log('session database connected');
                if (done) {
                    done();
                }
            })
        }));

        amna.$express.use(passport.initialize());
        amna.$express.use(passport.session());

        // Passport Login
        amna.$express.post('/auth', function (req, res, next) {
            passport.authenticate('local', function (err, user, message) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    if (req.query.redirect) {
                        return res.redirect(302, amna.authentication.urls.fail +
                            queryJSON({message: message || 'Authentication failed'}));
                    }
                    return res.status(400).json(amna.responses.error(message));
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    if (req.query.redirect) {
                        return res.redirect(302, amna.authentication.urls.success);
                    }
                    var response = req.user.privateJSON ? req.user.privateJSON() : req.user;
                    return res.status(200).json(amna.responses.ok(response));
                });
            })(req, res, next);
        });

        amna.$express.get('/deauth', function (req, res) {
            req.logOut();
            if (req.query.redirect) {
                return res.redirect(302, amna.authentication.urls.deauthSuccess);
            }
            res.status(200).json(amna.responses.ok());
        });

        if (amna.authentication.facebook) {
            /**
             * Redirect the user to Facebook for authentication.  When complete,
             * Facebook will redirect the user back to the application at
             *   /auth/facebook/callback
             */
            amna.$express.get('/auth/facebook', passport.authenticate('facebook'));

            /**
             * Authenticate based on a Facebook access token
             */
            amna.$express.post('/auth/facebook', passport.authenticate('facebook-token'),
                function (req, res) {
                    if (req.user) {
                        var response = req.user.privateJSON ? req.user.privateJSON() : req.user;
                        return res.status(200).json(amna.responses.ok(response));
                    }
                    return res.status(401).json(amna.responses.error('Invalid access token'));
                }
            );

            /**
             * Facebook will redirect the user to this URL after approval.  Finish the
             * authentication process by attempting to obtain an access token.  If
             * access was granted, the user will be logged in.  Otherwise,
             * authentication has failed.
             */
            amna.$express.get('/auth/facebook/callback',
                passport.authenticate('facebook', { successRedirect: amna.authentication.urls.authSuccess,
                                                    failureRedirect: amna.authentication.urls.authFailure }));
        }

        if (amna.authentication.google) {
            // GET /auth/google
            //   Use passport.authenticate() as route middleware to authenticate the
            //   request.  The first step in Google authentication will involve
            //   redirecting the user to google.com.  After authorization, Google
            //   will redirect the user back to this application at /auth/google/callback
            amna.$express.get('/auth/google',
                passport.authenticate('google', { scope: amna.get('google scope') }),
                function () {
                    // The request will be redirected to Google for authentication, so this
                    // function will not be called.
                });

            // GET /auth/google/callback
            //   Use passport.authenticate() as route middleware to authenticate the
            //   request.  If authentication fails, the user will be redirected back to the
            //   login page.  Otherwise, the primary route function function will be called,
            //   which, in this example, will redirect the user to the home page.
            amna.$express.get('/auth/google/callback',
                passport.authenticate('google', { failureRedirect: amna.authentication.urls.authFailure }),
                function (req, res) {
                    res.redirect(302, amna.authentication.urls.authSuccess);
                });
        }
    };

    return {};
};
