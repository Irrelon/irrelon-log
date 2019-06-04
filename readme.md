# Irrelon Log
A simple console logging module.

# Install
```bash
npm i irrelon-log
```

# Usage
```js
const {init} = require('./index');
const log = init('Demo File', '1.0.1');

log.info('Testing how a log line looks');

// Output is:
// 2019-06-04 18:01:09 (28563) [1.0.1] [DEBUG] *Demo File* Testing how a debug line looks

```

# Defaults
Irrelon Log sets some default levels for log lines. The module
determines if you are in dev or production by the NODE_ENV 
environment variable value.

The defaults are:

* debug: **off**
* info: **on** in "dev", **off** in "production"
* warn: **on** in "dev", **off** in "production"
* error: **on**

# Overriding Defaults
You can override default log levels in a number of ways either
in code or using environment variables. The environment variable
option provides a very thorough way to control logs at both
a global level (the entire application) and a module level (you
can set levels targeted at a module's name which will override
any levels specified in code).

## Env Var Language
When setting the value of a log level, you can use the log
level name to set to true / on or use an exclamation mark
and then the log level name to set to false / off. E.g.
"debug" (on) vs "!debug" (off).

## Examples of Environment Variable Settings

### All Logs Enabled
```bash
IRRELON_LOG=*
```

### All Logs Disabled
```bash
IRRELON_LOG=!*
```

### All Logs Enabled Except Debug
```bash
IRRELON_LOG=*,!debug
```

### All Logs Disabled Except Debug
```bash
IRRELON_LOG=!*,debug
```

## Module Level Environment Variable Settings
Imagine we have an application with many different modules.
In each module we wish to have log output we require or import
Irrelon Log and then setup a "log" constant to use:

```js
const {version} = require("./package"); // Read package.json for version
const {init} = require("irrelon-log");
const log = init("Module1", version);
```

Now imagine we have Module2, Module3 and so on.

During debugging we might want to control output so we silence
all other modules except Module2 and silence all Module2 log
levels EXCEPT "debug".

We can achieve this and many other scenarios like so:

### All Logs Disabled But Override "Module2" debug to Enabled
```bash
IRRELON_LOG=!*,Module2=debug
```

### All Logs Enabled But Override "Module2" debug to Disabled
```bash
IRRELON_LOG=*,Module2=!debug
```

### All Logs Enabled But Override Multiple Module Levels 
```bash
IRRELON_LOG=*,Module1=info,Module1=error,Module2=!debug
```

## Code-Based Level Settings / Overrides
At a module level you can set log level settings when calling init().

```js
const {version} = require("./package"); // Read package.json for version
const {init} = require("irrelon-log");
const log = init("Module1", version, {
	debug: true,
	info: false,
	warn: true,
	error: false
});
```

# Log Level Priority
Irrelon Log uses a priority order to determine if a log line should be output
or not. That priority order looks like this:

1) Module Level Environment Variable Value
2) Module Level Code Value
3) Global Level Environment Variable Value
4) Irrelon Log Default Value

If a value is found in (1) then we don't check (2) for a value
and so on. In other words the list above is from highest
priority to lowest.

# Methods
All methods eventually call a console.* method using
built-in console capability. The bit Irrelon Log does
is add a bunch of extra info on each call like the 
process id, date/time, application name and version.

All arguments sent to one of these methods is passed
to the console call so you can add as many args as you
like.

## debug (msg[,...])
Output a debug message via console.log(). This is different
from info() in that debug() should be used for development
purposes or when you are writing a module and want debug
output that module consumers can switch on or off. Debug
logs are disabled by default so module consumers must
explicitly enable them to see debug output.

```js
const obj = {foo: true};
log.info('Some object output', obj, "foo", "bar", 1, 2, 4);
```

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

