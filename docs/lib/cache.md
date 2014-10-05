<!-- -toc- -->
#### Table of Contents

- [Documentation Home](../../../../#documentation)
- `lib`
    - [`$express`](../../docs/lib/$express.md#amnaexpress)
    - [`authentication`](../../docs/lib/authentication.md#amnaauthentication)
    - **[`cache`](../../docs/lib/cache.md#amnacache)**
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
# `amna.cache`

<!-- - -->

The cache engine is currently setup to use mongodb as the cache store, this will likely become more flexible in the future.

## API

#### Read from cache

```JavaScript
amna.cache( ... any number of key arguments ... ).read([maxage,] function (err, record) {
    console.log('Got cache record:', record.key, record.value);
});
```

Example:

```JavaScript
amna.cache('california', 'population').read('1w', function (err, record) {
    if (err) throw err;

    if (record) {
        console.log('Got the population of CA from cache:', record.value);
    }

    else {
        console.log('Cache either not set, or is older than 1 week, cannot be trusted.');
    }
});
```

#### Save to cache

```JavaScript
amna.cache( ... any number of key arguments ... ).save(value, function (err, record) {
    console.log('Saved cache record:', record.key, record.value);
});
```

Example:

```JavaScript
amna.cache('california', 'population').set(38.33e6, function (err, record) {
    if (err) throw err;

    console.log('Saved CA population to cache:', record.value);
});
```
