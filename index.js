// If environment var LOG_LEVEL is set to "none" then no logs
// will be output to the console at all from this module. Same
// as calling log.mute(true);
const logLevel = process.env.LOG_LEVEL || ["info", "warn", "error"];
const colors = require('colors');

class Log {
	constructor (name, version = "", mute = logLevel === "none") {
		this.name(name);
		this.version(version);
		this.mute(mute)
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
		const args = this._msg(arguments, true);
		console.info.apply(console, args);
	}
	
	dir () {
		const args = this._msg(arguments, true);
		console.info.apply(console, [args[0], 'Output from log.dir() below']);
		console.dir.apply(console, [args[1]]);
	}
	
	error () {
		let argMsg = colors.red(arguments[0]);
		arguments[0] = argMsg;
		
		const args = this._msg(arguments);
		console.error.apply(console, args);
	}
	
	throw () {
		let argMsg = colors.red(arguments[0]);
		arguments[0] = argMsg;
		
		const args = this._msg(arguments);
		throw(args.join(' '));
	}
	
	mute (val) {
		if (val !== undefined) {
			this._mute = val;
			return this;
		}
		
		return this._mute;
	}
}

module.exports = Log;