const colors = require('colors');

class Log {
	constructor (name, version = "", mute = false) {
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
	
	_msg () {
		if (this.mute()) {
			return;
		}
		
		const dt = new Date();
		const dateTime = dt.toDateString() + ' ' + dt.toTimeString().substr(0, 8);
		const version = this.version();
		
		const args = [
			`${colors.cyan(process.pid)}`,
			`*${colors.green(this.name())}${version ? ' ' + colors.green(version) + '' : ""}*`,
			``,
			colors.yellow(dateTime),
			':'
		];
		let i;
		
		for (i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		
		return args;
	}
	
	info () {
		const args = this._msg.apply(this, arguments);
		console.info.apply(console, args);
	}
	
	error () {
		const args = this._msg.apply(this, arguments);
		console.error.apply(console, args);
	}
	
	throw () {
		const args = this._msg.apply(this, arguments);
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