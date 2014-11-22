/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Authentication - Facebook
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;

module.exports = function (amna, passport) {
    if (typeof amna.authentication.facebook !== 'function') {
        throw new Error('amna.authentication.facebook must be: function  (profile, tokens, done)');
    }

    var facebookClientID = amna.get('facebook app id');
    if (typeof facebookClientID !== 'string' || !facebookClientID.length) {
        throw new Error('amna setting "facebook app id" must be a string');
    }

    var facebookClientSecret = amna.get('facebook app secret');
    if (typeof facebookClientSecret !== 'string' || !facebookClientSecret.length) {
        throw new Error('amna setting "facebook app secret" must be a string');
    }

    var facebookScope = amna.get('facebook scope');
    if (!Array.isArray(facebookScope)) {
        facebookScope = ['public_profile'];
    }

    var domain = amna.get('domain');
    if (typeof domain !== 'string' || !domain.length) {
        throw new Error('amna setting "domain" must be set to the app domain for facebook login');
    }

    passport.use(new FacebookStrategy({
        clientID: facebookClientID,
        clientSecret: facebookClientSecret,
        callbackURL: domain + '/auth/facebook/callback',
        scope: facebookScope,
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
        var tokens = {access: accessToken, refresh: refreshToken};
        amna.authentication.facebook(profile._json, tokens, done);
    }));

    passport.use(new FacebookTokenStrategy({
        clientID: facebookClientID,
        clientSecret: facebookClientSecret
    }, function (accessToken, refreshToken, profile, done) {
        var tokens = {access: accessToken, refresh: refreshToken};
        amna.authentication.facebook(profile._json, tokens, done);
    }));
};
