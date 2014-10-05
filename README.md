# `amna`

<b>A</b>mazing <b>M</b>ongoose <b>N</b>ode.js <b>A</b>PI

# Release Status

No release is currently avaiable.

```
0.1.0 development
#################### 100%


0.1.0 documentation
#                    5%


0.1.0 testing
                     0%
```

# Installation

```bash
npm install amna
```

# Usage

```JavaScript
var amna = require('amna');

amna.registerThings([ ... ]);       // Models & Schemas
amna.registerServices([ ... ]);     // Global Services
amna.registerModules('/', [ ... ]); // URL Modules
//                    ^ base URL

amna.start({
    mongo: {db: 'amna-test'},       // Mongo connection
    port: 8080,                     // Port
    settings: {                     // Express app settings
        'key': 'value'
    }
});
```

# Introduction

Amna is a highly opinionated, pre-structured API development platform. It eliminates a lot of the typical repetitive code that is found in many Node.js API projects. Amna combines the following packages into one cohesive framework, and wraps commonly used functionality:

- Express 4
- Passport
- Mongoose
    - Find or Create
    - Text Search
    - Types
- EJS Templates
- Jade Templates (coming soon)
- Static Server

# Terminology

### Thing

An `amna.thing` is an object model containing a schema, and various helper methods. Things are available at `amna.things.*` after registration.

### Service

A service is a globally availible JavaScript object or function, available at `amna.services.*` after registration.

### Module

A module is a URL route handler, and may be composed of `amna.route`, `amna.controller`, or `amna.collection` types.

# Example Projects

*Coming soon...*

# Documentation

> Technical Note: to regenerate the following section, run `node ./dev/docs`

<span class="toc">
### Table of Contents

- [Documentation Home](../../)
- `lib`
    - [$express](docs/lib/$express.md)
    - [authentication](docs/lib/authentication.md)
    - [cache](docs/lib/cache.md)
    - [collection](docs/lib/collection.md)
    - [controller](docs/lib/controller.md)
    - [err](docs/lib/err.md)
    - [get](docs/lib/get.md)
    - [interaction](docs/lib/interaction.md)
    - [mongo](docs/lib/mongo.md)
    - [refs](docs/lib/refs.md)
    - [registerModules](docs/lib/registerModules.md)
    - [registerServices](docs/lib/registerServices.md)
    - [registerThings](docs/lib/registerThings.md)
    - [responses](docs/lib/responses.md)
    - [route](docs/lib/route.md)
    - [services](docs/lib/services.md)
    - [set](docs/lib/set.md)
    - [stack](docs/lib/stack.md)
    - [start](docs/lib/start.md)
    - [static](docs/lib/static.md)
    - [thing](docs/lib/thing.md)
    - [things](docs/lib/things.md)
    - [types](docs/lib/types.md)
</span>
