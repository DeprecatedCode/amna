/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Authentication
 */
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

module.exports = function (amna, log) {

    var queryJSON = function (data) {
        return '?' + encodeURIComponent(JSON.stringify(data));
    };

    /**
     * Called during amna.start()
     */
    amna.$auth = function () {
        if (typeof amna.authentication.serializeUser !== 'function') {
            throw new Error('amna.authentication.serializeUser must be defined and a function');
        }
        if (typeof amna.authentication.deserializeUser !== 'function') {
            throw new Error('amna.authentication.deserializeUser must be defined and a function');
        }
        passport.serializeUser(amna.authentication.serializeUser);
        passport.deserializeUser(amna.authentication.deserializeUser);

        if (amna.authentication.facebook) {

            if (typeof amna.authentication.facebook !== 'function') {
                throw new Error('amna.authentication.facebook must be a function');
            }

            var facebookClientID = amna.get('facebook app id');
            if (typeof facebookClientID !== 'string' || !facebookClientID.length) {
                throw new Error('amna setting "facebook app id" must be a string');
            }

            var facebookClientSecret = amna.get('facebook app secret');
            if (typeof facebookClientSecret !== 'string' || !facebookClientSecret.length) {
                throw new Error('amna setting "facebook app secret" must be a string');
            }

            var domain = amna.get('domain');
            if (typeof domain !== 'string' || !domain.length) {
                throw new Error('amna setting "domain" must be set to the app domain for facebook login');
            }

            passport.use(new FacebookStrategy({
                clientID: facebookClientID,
                clientSecret: facebookClientSecret,
                callbackURL: 'http://' + domain + '/auth/facebook/callback',
                profileFields: [
                    'age_range',
                    'birthday',
                    'email',
                    'gender',
                    'id',
                    'first_name',
                    'last_name',
                    'picture',
                    'timezone'
                ]
            }, function (accessToken, refreshToken, profile, done) {
                amna.authentication.facebook(profile._json, done);
            }));
        }

        if (amna.authentication.local) {
            if (typeof amna.authentication.local !== 'function') {
                throw new Error('amna.authentication.local must be a function');
            }
            passport.use(new LocalStrategy(amna.authentication.local));
        }

        amna.$express.use(session({
            secret: amna.$express.get('secret'),
            store: new MongoStore({
                mongoose_connection: amna.$mongooseConnection.connections[0]
            }, function () {
                log('session database connected');
            })
        }));

        amna.$express.use(passport.initialize());
        amna.$express.use(passport.session());

        // Passport Login
        amna.$express.post('/auth', function (req, res, next) {
            passport.authenticate('local', function (err, user, message) {
                if (err) { return next(err); }
                if (!user) {
                    if (req.query.redirect) {
                        return res.redirect(amna.authentication.urls.fail +
                            queryJSON({message: message || 'Authentication failed'}));
                    }
                    return res.json(400, amna.responses.error(message));
                }
                req.logIn(user, function (err) {
                    if (err) { return next(err); }
                    if (req.query.redirect) {
                        return res.redirect(amna.authentication.urls.success);
                    }
                    return res.json(200, amna.responses.ok(req.user.privateJSON()));
                });
            })(req, res, next);
        });

        amna.$express.get('/deauth', function (req, res, next) {
            req.logOut();
            if (req.query.redirect) {
                return res.redirect(amna.authentication.urls.deauth);
            }
            res.json(200, amna.responses.ok());
        });

        // Redirect the user to Facebook for authentication.  When complete,
        // Facebook will redirect the user back to the application at
        //     /auth/facebook/callback
        amna.$express.get('/auth/facebook', passport.authenticate('facebook',
            {scope: ['public_profile', 'email', 'user_friends']}));

        // Facebook will redirect the user to this URL after approval.  Finish the
        // authentication process by attempting to obtain an access token.  If
        // access was granted, the user will be logged in.  Otherwise,
        // authentication has failed.
        amna.$express.get('/auth/facebook/callback', 
          passport.authenticate('facebook', { successRedirect: '/',
                                              failureRedirect: '/auth' }));
    };

    // Update password
    // amna.$express.post('/auth/password', function (req, res, next) {
    //     if (!req.user) {
    //         if (req.query.redirect) {
    //             return res.redirect('/' + queryJSON({message: 'Not authenticated'}));
    //         }
    //         return res.json(401, amna.responses.error('Not Authenticated'));
    //     }

    //     if (typeof req.body.password !== 'string' || req.body.password < 6) {
    //         if (req.query.redirect) {
    //             return res.redirect('/' + queryJSON({message: 'Password must be at least 6 characters'}));
    //         }
    //         return res.json(400, amna.responses.error('Password must be at least 6 characters'));
    //     }

    //     req.user.password = req.body.password;

    //     req.user.save(function (err, user) {
    //         if (err) { return next(err); }
    //         if (req.query.redirect) {
    //             return res.redirect('/' + queryJSON({message: 'Password updated'}));
    //         }
    //         res.json(200, amna.responses.ok());
    //     })
    // });

    return {};
};
