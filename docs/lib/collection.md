<!-- -toc- -->
#### Table of Contents

- [Documentation Home](../../../../#documentation)
- `lib`
    - [`$express`](../../docs/lib/$express.md#amnaexpress)
    - [`authentication`](../../docs/lib/authentication.md#amnaauthentication)
    - [`cache`](../../docs/lib/cache.md#amnacache)
    - **[`collection`](../../docs/lib/collection.md#amnacollection)**
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
# `amna.collection`

<!-- - -->

Represents a complete API for a thing. Fully customizable and extendable.

## API

#### Use as an amna Module

```JavaScript
// File: amna_modules/colors/module.js

var amna = require('amna');

/**
 * Rest API: Colors
 */
var ColorsAPI = module.exports = amna.collection(amna.things.Color,
                                                 { ... options (optional) ...});
```

Once registered with `amna.registerModules(['colors']);`, this sets up the basic CRUD operations for the Color thing. 

#### Default API Routes

The following are the automatically available API routes if no overrides are specified:

```bash
GET /colors/schema
    Returns a JSON representation of the thing schema
    Lives at ColorsAPI.routes.collectionGetSchema

GET /colors/autocomplete?{"$input":"bl"}
    Returns colors with a word starting with "bl" (i.e. "light blue", "blue")
    Lives at ColorsAPI.routes.collectionGetAutocomplete

GET /colors ................................. returns first page of non-deleted colors,
                                                at 20 items per page
GET /colors?{"name":"red"} .................. returns all colors with name "red"
GET /colors?[{},{"limit":10}] ............... returns first page of non-deleted colors,
                                                at 10 items per page
GET /colors?[{},{"deleted":null}] ........... returns first page of all colors,
                                                whether deleted or not
GET /colors?[{},{"deleted":true}] ........... returns first page of deleted colors
    Lives at ColorsAPI.routes.collectionGet

POST /colors
    Creates a color (or multiple colors if body is [{...}, {...}, ...])
    Lives at ColorsAPI.routes.collectionPost

GET /colors/:id
    Returns a single color by id
    Lives at ColorsAPI.routes.documentGet

PUT /colors/:id
    Updates a single color by id
    Lives at ColorsAPI.routes.documentPut

DELETE /colors/:id
    Deletes a single color by id
    Lives at ColorsAPI.routes.documentDelete
```

Any of the default routes can be disabled by specifying the name of the route in the options object, with a value of `false`.

Example:

```JavaScript
/**
 * Rest API: Colors
 */
var ColorsAPI = module.exports = amna.collection(amna.things.Color,
                                                 {documentDelete: false,
                                                  collectionGetSchema: false,
                                                  collectionGetAutocomplete: false});
```

Now, the routes for deleting a color, getting the color schema, or autocompleting a color name will all cause a 404 not found error, unless you add custom routes to replace them.

To further understand how you can work with these and other routes, please see the documentation section on [`amna.route`](../../docs/lib/route.md#amnaroute). All `ColorsAPI.routes.*` are instances of `amna.route`.

#### Custom API Routes

Extending the default set of collection routes is super easy. Choose one of the following methods based on the scope (collection or document) and method you intend to use for the route.

All extension helpers:

```JavaScript
ColorsAPI.collectionGet(url, function (self) { ... });
ColorsAPI.collectionPost(url, function (self) { ... });
ColorsAPI.collectionPut(url, function (self) { ... });
ColorsAPI.collectionDelete(url, function (self) { ... });

ColorsAPI.documentGet(url, function (self) { ... });
ColorsAPI.documentPost(url, function (self) { ... });
ColorsAPI.documentPut(url, function (self) { ... });
ColorsAPI.documentDelete(url, function (self) { ... });
```

The variable `self` is an instance of [`interaction`](../../docs/lib/interaction.md#amnainteraction).

Example:

```JavaScript
ColorsAPI.collectionGet('/info', function (self) {
    self.done('This is the Colors API');
});
```

Then, if you were to visit `/colors/info` in your browser, you would get the following API response:

```JavaScript
{
    "status": "ok",
    "data": "This is the Colors API"
}
```
