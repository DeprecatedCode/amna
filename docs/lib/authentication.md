<!-- -toc- -->
#### Table of Contents

- [Documentation Home](../../../../#documentation)
- `lib`
    - [`$express`](../../docs/lib/$express.md#amnaexpress)
    - [`authentication-facebook`](../../docs/lib/authentication-facebook.md#amnaauthentication-facebook)
    - [`authentication-google`](../../docs/lib/authentication-google.md#amnaauthentication-google)
    - **[`authentication`](../../docs/lib/authentication.md#amnaauthentication)**
    - [`cache`](../../docs/lib/cache.md#amnacache)
    - [`collection`](../../docs/lib/collection.md#amnacollection)
    - [`controller`](../../docs/lib/controller.md#amnacontroller)
    - [`err`](../../docs/lib/err.md#amnaerr)
    - [`get`](../../docs/lib/get.md#amnaget)
    - [`interaction`](../../docs/lib/interaction.md#amnainteraction)
    - [`mongo`](../../docs/lib/mongo.md#amnamongo)
    - [`refs`](../../docs/lib/refs.md#amnarefs)
    - [`registerModules`](../../docs/lib/registerModules.md#amnaregistermodules)
    - [`registerServices`](../../docs/lib/registerServices.md#amnaregisterservices)
    - [`registerThings`](../../docs/lib/registerThings.md#amnaregisterthings)
    - [`responses`](../../docs/lib/responses.md#amnaresponses)
    - [`route`](../../docs/lib/route.md#amnaroute)
    - [`services`](../../docs/lib/services.md#amnaservices)
    - [`set`](../../docs/lib/set.md#amnaset)
    - [`stack`](../../docs/lib/stack.md#amnastack)
    - [`start`](../../docs/lib/start.md#amnastart)
    - [`static`](../../docs/lib/static.md#amnastatic)
    - [`thing`](../../docs/lib/thing.md#amnathing)
    - [`things`](../../docs/lib/things.md#amnathings)
    - [`types`](../../docs/lib/types.md#amnatypes)

<!-- - -->

<!-- -title- -->
# `amna.authentication`

<!-- - -->

Before calling `amna.start(...)`, authentication must be set up. You must provide a function that will be called automatically just before startup. Normally it should look something like this:

```JavaScript
amna.authentication = function () {
    return {
        /**
         * Enable username and password login
         */
        local: amna.things.User.model.findByEmailAndPassword,

        // In amna_things/user.js
        // User.schema.statics.findByEmailAndPassword = function (email, password, done) { ... };

        /**
         * Enable Facebook login (just leave this off to disable Facebook login)
         */
        facebook: amna.things.User.model.findOrCreateFromFacebook,

        // In amna_things/user.js:
        // User.schema.statics.findOrCreateFromFacebook = function (profile, done) { ... };
        // The profile is the raw response from Facebook

        /**
         * Urls
         */
        urls: {
            deauth:     '/',    // where to redirect after deauth (logout)
            fail:       '/',    // where to redirect when login fails
            success:    '/'     // where to redirect when login succeeds
        },

        /**
         * Save User on the session data
         */
        serializeUser: function (user, done) {
            done(null, user.id);
        },

        /**
         * Load User from the session data
         */
        deserializeUser: function (id, done) {
            amna.things.User.model.findById(id, done);
        }
    }
};
```
