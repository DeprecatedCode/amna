<!-- -toc- -->
#### Table of Contents

- [Documentation Home](../../../../#documentation)
- `lib`
    - [$express](../../docs/lib/$express.md#amnaexpress)
    - [authentication](../../docs/lib/authentication.md#amnaauthentication)
    - [cache](../../docs/lib/cache.md#amnacache)
    - **[collection](../../docs/lib/collection.md#amnacollection)**
    - [controller](../../docs/lib/controller.md#amnacontroller)
    - [err](../../docs/lib/err.md#amnaerr)
    - [get](../../docs/lib/get.md#amnaget)
    - [interaction](../../docs/lib/interaction.md#amnainteraction)
    - [mongo](../../docs/lib/mongo.md#amnamongo)
    - [refs](../../docs/lib/refs.md#amnarefs)
    - [registerModules](../../docs/lib/registerModules.md#amnaregistermodules)
    - [registerServices](../../docs/lib/registerServices.md#amnaregisterservices)
    - [registerThings](../../docs/lib/registerThings.md#amnaregisterthings)
    - [responses](../../docs/lib/responses.md#amnaresponses)
    - [route](../../docs/lib/route.md#amnaroute)
    - [services](../../docs/lib/services.md#amnaservices)
    - [set](../../docs/lib/set.md#amnaset)
    - [stack](../../docs/lib/stack.md#amnastack)
    - [start](../../docs/lib/start.md#amnastart)
    - [static](../../docs/lib/static.md#amnastatic)
    - [thing](../../docs/lib/thing.md#amnathing)
    - [things](../../docs/lib/things.md#amnathings)
    - [types](../../docs/lib/types.md#amnatypes)

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
var ColorsAPI = module.exports = amna.collection(amna.things.Color);
```

Once registered with `amna.registerModules(['colors']);`, this sets up the basic CRUD operations for the Color thing. Automatically available API routes:

```bash
GET /colors/schema
    Returns a JSON representation of the thing schema
    Lives at ColorsAPI.routes.collectionGetSchema

GET /colors/autocomplete?{"$input":"bl"}
    Returns colors with a word starting with "bl"
    Lives at ColorsAPI.routes.collectionGetAutocomplete

GET /colors ................................. returns first page of non-deleted colors, at 20 items per page
GET /colors?{"name":"red"} .................. returns all colors with name "red"
GET /colors?[{},{"limit":10}] ............... returns first page of non-deleted colors, at 10 items per page
GET /colors?[{},{"deleted":null}] ........... returns first page of all colors, whether deleted or not
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
