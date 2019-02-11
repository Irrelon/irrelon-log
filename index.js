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
		const dateTime = colors.yellow(`${dt.toISOString().substr(0, 10)} ${dt.toTimeString().substr(0, 8)}`);
		const versionNum = this.version();
		const name = colors.green(this.name());
		const version = versionNum ? ` ${colors.green(versionNum)}` : '';
		const pid = (process && process.pid) ? `(${colors.cyan(process.pid)}) ` : '';
		
		const args = [
			`[${dateTime} ${pid}*${name}${version}*]`
		];
		
		for (let i = 0; i < arguments.length; i++) {
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