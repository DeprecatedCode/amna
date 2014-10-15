/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA - Authentication - Google
 */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (amna, passport) {
    if (typeof amna.authentication.google !== 'function') {
        throw new Error('amna.authentication.google must be: function (profile, tokens, done)');
    }

    var googleClientID = amna.get('google client id');
    if (typeof googleClientID !== 'string' || !googleClientID.length) {
        throw new Error('amna setting "google client id" must be a string');
    }

    var googleClientSecret = amna.get('google client secret');
    if (typeof googleClientSecret !== 'string' || !googleClientSecret.length) {
        throw new Error('amna setting "google client secret" must be a string');
    }

    var googleScope = amna.get('google scope');
    if (!Array.isArray(googleScope)) {
        throw new Error('amna setting "google scope" must be an Array');
    }

    var domain = amna.get('domain');
    if (typeof domain !== 'string' || !domain.length) {
        throw new Error('amna setting "domain" must be set to the app domain for google login');
    }

    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: domain + '/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        var tokens = {access: accessToken, refresh: refreshToken};
        amna.authentication.google(profile._json, tokens, done);
    }));
};
