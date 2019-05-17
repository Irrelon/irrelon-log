// If environment var LOG_LEVEL is set to "none" then no logs
// will be output to the console at all from this module. Same
// as calling log.mute(true);
let logLevel;

if (process.env.LOG_LEVEL && process.env.LOG_LEVEL.indexOf("[") === 0) {
	try {
		logLevel = JSON.parse(process.env.LOG_LEVEL);
	} catch (e) {}
} else if (process.env.LOG_LEVEL === "none") {
	logLevel = ["none"];
} else {
	logLevel = ["info", "debug", "warn", "error"];
}

const colors = require('colors');

class Log {
	constructor (name, version = "", mute = false) {
		this.name(name);
		this.version(version);
		this.logLevel(logLevel);
		
		if (mute === true || (logLevel.length === 1 && logLevel[0] === "none")) {
			this.mute(true);
		}
	}
	
	name (val) {
		if (val !== undefined) {
			this._name = val;
			return this;
		}
		
		return this._name;
	}
	
	version (val) {
		if (val !== undefined) {
			this._version = val;
			return this;
		}
		
		return this._version;
	}
	
	mute (val) {
		if (val !== undefined) {
			this._mute = val;
			return this;
		}
		
		return this._mute;
	}
	
	logLevel (val) {
		if (val !== undefined) {
			this._logLevel = val;
			return this;
		}
		
		return this._logLevel;
	}
	
	logLevelEnabled (levelName) {
		return this._logLevel && this._logLevel.indexOf(levelName);
	}
	
	_msg (originalArguments, enableColors = true) {
		if (this.mute()) {
			return;
		}
		
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
		const versionNum = this.version();
		const name = ourColors.green(this.name());
		const version = versionNum ? `[${ourColors.green(versionNum)}] ` : `[${ourColors.green('-.-.-')}] `;
		const pid = (process && process.pid) ? `(${ourColors.cyan(process.pid)}) ` : '';
		
		const args = [
			`${dateTime} ${pid}${version}*${name}*`
		];
		
		for (let i = 0; i < originalArguments.length; i++) {
			args.push(originalArguments[i]);
		}
		
		return args;
	}
	
	info () {
		if (this.mute() || !this.logLevelEnabled("info")) {
			return;
		}
		
		const args = this._msg(arguments, true);
		console.info.apply(console, args);
	}
	
	debug () {
		if (this.mute() || !this.logLevelEnabled("debug")) {
			return;
		}
		
		const args = this._msg(arguments, true);
		console.info.apply(console, args);
	}
	
	dir () {
		if (this.mute()) {
			return;
		}
		
		const args = this._msg(arguments, true);
		console.info.apply(console, [args[0], 'Output from log.dir() below']);
		console.dir.apply(console, [args[1]]);
	}
	
	warn () {
		if (this.mute() || !this.logLevelEnabled("warn")) {
			return;
		}
		
		arguments[0] = colors.yellow(arguments[0]);
		
		const args = this._msg(arguments);
		console.warn.apply(console, args);
	}
	
	error () {
		if (this.mute() || !this.logLevelEnabled("error")) {
			return;
		}
		
		arguments[0] = colors.red(arguments[0]);
		
		const args = this._msg(arguments);
		console.error.apply(console, args);
	}
	
	throw () {
		arguments[0] = colors.red(arguments[0]);
		
		const args = this._msg(arguments);
		throw(args.join(' '));
	}
}

module.exports = Log;