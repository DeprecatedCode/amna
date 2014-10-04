# `amna`

**A**mazing **M**ongoose **N**ode.js **A**PI

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

<toc>
</toc>
