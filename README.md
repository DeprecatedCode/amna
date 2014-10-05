# `amna`

<b>A</b>mazing <b>M</b>ongoose <b>N</b>ode.js <b>A</b>PI

## Release Status

No release is currently avaiable.

```
0.1.0 development
#################### 100%


0.1.0 documentation
#                    5%


0.1.0 testing
                     0%
```

## Installation

```bash
npm install amna
```

## Usage

```JavaScript
var amna = require('amna');

amna.registerServices([ ... ]);     // Global Services
amna.registerThings([ ... ]);       // Models & Schemas

// Additional setup goes here
// - authentication (see authentication under Table of Contents)
// - amna.set('view engine', 'ejs') if you need views

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

## Introduction

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

## Terminology

#### Thing

An `amna.thing` is an object model containing a schema, and various helper methods. Things are available at `amna.things.*` after registration.

Things are registered by a call to `amna.registerThings(['thing_name'])`, which loads `amna.$THINGS_DIR/thing_name.js` - by default set to `./amna_things` relative to your project's root folder. You can change this path (not recommended) by setting `amna.$THINGS_DIR = 'some_things_dir';` in the additional setup section of your app's main file. 

#### Service

A service is a globally availible JavaScript object or function, available at `amna.services.*` after registration.

Services are registered by a call to `amna.registerServices(['service_name'])`, which loads `amna.$SERVICES_DIR/service_name.js` - by default set to `./amna_services` relative to your project's root folder. You can change this path (not recommended) by setting `amna.$SERVICES_DIR = 'some_services_dir';` in the additional setup section of your app's main file.

#### Module

A module is a URL route handler, and may be composed of `amna.route`, `amna.controller`, or `amna.collection` types.

Modules are registered by a call to `amna.registerModules(['module_name'])`, which loads `amna.$MODULES_DIR/module_name/module.js` - by default set to `./amna_modules` relative to your project's root folder. You can change this path (not recommended) by setting `amna.$MODULES_DIR = 'some_modules_dir';` in the additional setup section of your app's main file.

## Example Projects

*Coming soon...*

## Documentation

> Technical Note: to regenerate the following section, run `node ./dev/docs`

<!-- -toc- -->
#### Table of Contents

- [Documentation Home](../../#documentation)
- `lib`
    - [$express](docs/lib/$express.md#amnaexpress)
    - [authentication](docs/lib/authentication.md#amnaauthentication)
    - [cache](docs/lib/cache.md#amnacache)
    - [collection](docs/lib/collection.md#amnacollection)
    - [controller](docs/lib/controller.md#amnacontroller)
    - [err](docs/lib/err.md#amnaerr)
    - [get](docs/lib/get.md#amnaget)
    - [interaction](docs/lib/interaction.md#amnainteraction)
    - [mongo](docs/lib/mongo.md#amnamongo)
    - [refs](docs/lib/refs.md#amnarefs)
    - [registerModules](docs/lib/registerModules.md#amnaregistermodules)
    - [registerServices](docs/lib/registerServices.md#amnaregisterservices)
    - [registerThings](docs/lib/registerThings.md#amnaregisterthings)
    - [responses](docs/lib/responses.md#amnaresponses)
    - [route](docs/lib/route.md#amnaroute)
    - [services](docs/lib/services.md#amnaservices)
    - [set](docs/lib/set.md#amnaset)
    - [stack](docs/lib/stack.md#amnastack)
    - [start](docs/lib/start.md#amnastart)
    - [static](docs/lib/static.md#amnastatic)
    - [thing](docs/lib/thing.md#amnathing)
    - [things](docs/lib/things.md#amnathings)
    - [types](docs/lib/types.md#amnatypes)

<!-- - -->
