const colors = require('colors');

let _env = "IRRELON_LOG";
let _globalLevelSettings = {
	"debug": false,
	"info": false,
	"warn": false,
	"error": false
};

/**
 * Sets the name of the environment variable to read log level settings from.
 * @param {String} name The name of the env var to read from.
 * @returns {String} The current env var name.
 */
const env = (name) => {
	if (name !== undefined) {
		// Record the env var name
		_env = name;
		
		// Now read the env var we were told about and set the level from it
		if (typeof process !== "undefined" && typeof process.env === "object") {
			const envVarVal = process.env[name];
			
			// Check if the env var contains JSON
			try {
				const json = JSON.parse(envVarVal);
				setLevel(json);
			} catch (e) {
				// The env var does not contain JSON, assume it is a single text setting name e.g. debug
				setLevel(envVarVal);
			}
		}
	}
	
	return _env;
};

/**
 * Gets the current value of the specified log level.
 * @param {String} name The name of the log level to get the current value for
 * e.g. "debug", "info" etc.
 * @returns {Boolean} The current value.
 */
const getLevel = (name) => {
	const val = _globalLevelSettings[name];
	return val !== undefined ? val : false;
};

/**
 * Sets log level values for one or more log levels.
 * @param {String|Array|Object} setting The setting data.
 * @param {Boolean=} value Optional value to set.
 * @returns {boolean|{warn: boolean, debug: boolean, error: boolean, info: boolean}}
 */
const setLevel = (setting, value) => {
	if (setting === undefined) {
		return;
	}
	
	if (setting instanceof Array) {
		// An array of level settings
		setting.forEach((item) => {
			setLevel(item, true);
		});
	} else if (typeof setting === "object") {
		Object.keys(setting).forEach((item) => {
			setLevel(item, setting[item]);
		});
	} else if (setting === "*") {
		// Turn all settings on
		Object.keys(_globalLevelSettings).forEach((item) => {
			setLevel(item, true);
		});
	} else if (setting === "!*") {
		// Turn all settings off
		Object.keys(_globalLevelSettings).forEach((item) => {
			setLevel(item, false);
		});
	} else if (typeof setting === "string" && setting.indexOf(",") !== -1) {
		// We have a comma separated values list, convert to array
		// and assume all are off unless otherwise specified
		const settingArr = setting.split(",");
		settingArr.forEach((item) => {
			setLevel(item);
		});
	} else if (typeof setting === "string" && setting.startsWith('!')) {
		
		// All except this setting
		setting = setting.slice(1);
		
		Object.keys(_globalLevelSettings).forEach((item) => {
			if (item === setting) {
				setLevel(item, false);
			} else {
				setLevel(item, true);
			}
		});
	} else if (typeof setting === "string") {
		// Only this setting
		if (value === undefined) {
			value = true;
		}
		
		_globalLevelSettings[setting] = value;
	} else {
		// No idea what to do here!
		throw("Call to level() failed because we don't understand the setting provided! You can pass an object, an array or a string name as the first parameter")
	}
	
	return _globalLevelSettings;
};

const levelEnabled = (levelName, ...levelSettings) => {
	// Find the first matching level setting and use it
	const setting = levelSettings.find((levelData) => {
		if (levelData && levelData[levelName] !== undefined) {
			return true;
		}
	});
	
	return setting[levelName];
};

const consoleArgs = (levelName, moduleName, moduleVersion, originalArguments, enableColors = true) => {
	let ourColors = colors;
	
	if (!enableColors) {
		const returnSelf = (val) => { return val; };
		
		ourColors = {
			black: returnSelf,
			red: returnSelf,
			green: returnSelf,
			yellow: returnSelf,
			blue: returnSelf,
			magenta: returnSelf,
			cyan: returnSelf,
			white: returnSelf,
			gray: returnSelf,
			grey: returnSelf
		}
	}
	
	const dt = new Date();
	const dateTime = ourColors.yellow(`${dt.toISOString().substr(0, 10)} ${dt.toTimeString().substr(0, 8)}`);
	const pid = (process && process.pid) ? `(${ourColors.cyan(process.pid)}) ` : '';
	const versionNum = moduleVersion;
	const name = ourColors.green(moduleName);
	const version = versionNum ? `[${ourColors.green(versionNum)}] ` : `[${ourColors.green('-.-.-')}] `;
	const levelText = `[${levelName.toUpperCase()}] `;
	
	const args = [
		`${dateTime} ${pid}${version}${levelText}*${name}*`
	];
	
	for (let i = 0; i < originalArguments.length; i++) {
		args.push(originalArguments[i]);
	}
	
	return args;
};

const Log = function (moduleName, moduleVersion, moduleLevelSettings) {
	const applyMiddleWare = (middleWare, args) => {
		if (middleWare.length) {
			middleWare.map((middleWareFunc) => {
				const newArgs = middleWareFunc(...args);
				
				if (!(newArgs instanceof Array)) {
					// Throw here as middleWare failed
					throw new Error("Middleware function failed to return an array: " + middleWareFunc.toString());
				}
				
				args = newArgs;
			});
		}
		
		return args;
	};
	
	const logFunc = (levelName, ...middleWare) => {
		/**
		 * Send a message to the console.
		 * @param {*} msg The message to send.
		 * @param {...*} otherArgs Any further args to send to the console.
		 */
		return function (msg, ...otherArgs) {
			if (!levelEnabled(levelName, moduleLevelSettings, _globalLevelSettings)) {
				return;
			}
			
			let finalArgs = arguments;
			finalArgs = applyMiddleWare(middleWare, finalArgs);
			
			const args = consoleArgs(levelName, moduleName, moduleVersion, finalArgs);
			return console.log.apply(console, args);
		}
	};
	
	const strFunc = (levelName, ...middleWare) => {
		/**
		 * Generates a string log line but does not send it to the console.
		 * @param {*} msg The message to send.
		 * @param {...*} otherArgs Any further args to send to the console.
		 * @returns {String} The log line as a string.
		 */
		return function (msg, ...otherArgs) {
			if (!levelEnabled(levelName, moduleLevelSettings, _globalLevelSettings)) {
				return;
			}
			
			let finalArgs = arguments;
			finalArgs = applyMiddleWare(middleWare, finalArgs);
			
			const args = consoleArgs(levelName, moduleName, moduleVersion, finalArgs, false);
			return args.join(" ");
		}
	};
	
	
	return {
		"debug": logFunc("debug", (arg1, ...args) => { arg1 = colors.white(arg1); return [arg1, ...args]; }),
		"info": logFunc("info", (arg1, ...args) => { arg1 = colors.white(arg1); return [arg1, ...args]; }),
		"warn": logFunc("warn", (arg1, ...args) => { arg1 = colors.yellow(arg1); return [arg1, ...args]; }),
		"error": logFunc("error", (arg1, ...args) => { arg1 = colors.red(arg1); return [arg1, ...args]; }),
		"debugLine": strFunc("debug"),
		"errorLine": strFunc("info"),
		"warnLine": strFunc("warn"),
		"infoLine": strFunc("error")
	};
};

/**
 * Creates a new log instance for a module in your code.
 * @param {String} moduleName The name of the module this log instance is for.
 * @param {String} version The version of the module this log instance is for.
 * @param {Object=} level Calls setLevel() but applies the passed
 * levels only to this instance.
 * @returns {{warn: (function(*, ...[*]): void), debug: (function(*, ...[*]): void), infoLine: (function(*, ...[*]): string), warnLine: (function(*, ...[*]): string), error: (function(*, ...[*]): void), debugLine: (function(*, ...[*]): string), errorLine: (function(*, ...[*]): string), info: (function(*, ...[*]): void)}}
 */
const init = (moduleName, version = "_._._", level = {}) => {
	return new Log(moduleName, version, level);
};

// Default the log level env var name to IRRELON_LOG
env("IRRELON_LOG");

module.exports = {
	env,
	getLevel,
	setLevel,
	init
};