const assert = require("assert");
const {setLevel, init} = require("../index");

describe("log()", () => {
	it("Will correctly log when the log level is enabled", () => {
		setLevel("debug", true);
		
		const log = init("Test module", "1.0.0");
		const str = log.debugLine("Test");
		const dt = new Date();
		const dateTime = `${dt.toISOString().substr(0, 10)} ${dt.toTimeString().substr(0, 8)}`;
		const pid = process.pid;
		
		assert.strictEqual(str, `${dateTime} (${pid}) [1.0.0] [DEBUG] *Test module* Test`, "The value is correct");
	});
	
	it("Will correctly log when the log level is disabled", () => {
		setLevel("debug", true);
		
		const log = init("Test module", "1.0.0", {debug: false});
		const str = log.debugLine("Test");
		
		assert.strictEqual(str, undefined, "The value is correct");
	});
});