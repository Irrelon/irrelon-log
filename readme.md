# Irrelon Log
A simple console logging module.

# Install
```bash
npm i irrelon-log
```

# Usage
```js
const Log = require('./index');
const log = new Log('Demo File', '1.0.1');

log.info('Testing how a log line looks');

// Output is:
// 21020 *Demo File 1.0.1*  Wed Jan 30 2019 20:53:50 : Testing how a log line looks

```

# Methods
All methods eventually call a console.* method using
built-in console capability. The bit Irrelon Log does
is add a bunch of extra info on each call like the 
process id, date/time, application name and version.

## info (msg[,...])
Output an info message via console.log().

```js
const obj = {foo: true};
log.info('Some object output', obj);
```

## warn (msg[,...])
Output a warning via console.warn().

```js
const obj = {foo: true};
log.warn('Some object output', obj);
```

## error (msg[,...])
Output an error via console.error().

```js
const obj = {foo: true};
log.error('Some object output', obj);
```

## throw (msg[,...])
Same as error but after outputting the console.error() it will
also throw an error of the same message as the first argument.

```js
const obj = {foo: true};
log.throw('Some object output', obj);
```