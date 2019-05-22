const assert = require("assert");
const {setLevel, getLevel} = require("../index");

describe("level()", () => {
	it("Will set the log level via a name with an infered value", () => {
		setLevel("debug");
		setLevel("!info");
		
		const debugVal = getLevel("debug");
		const infoVal = getLevel("info");
		
		assert.strictEqual(debugVal, true, "The value is correct");
		assert.strictEqual(infoVal, false, "The value is correct");
	});
	
	it("Will set the log level via a name and value", () => {
		setLevel("debug", true);
		const val = getLevel("debug");
		
		assert.strictEqual(val, true, "The value is correct");
	});
	
	it("Will set the log level via an array of names", () => {
		setLevel(["debug", "!info"]);
		
		const debugVal = getLevel("debug");
		const infoVal = getLevel("info");
		
		assert.strictEqual(debugVal, true, "The value is correct");
		assert.strictEqual(infoVal, false, "The value is correct");
	});
	
	it("Will set the log level via an object of names and values", () => {
		setLevel({
			debug: false,
			info: true
		});
		
		const debugVal = getLevel("debug");
		const infoVal = getLevel("info");
		
		assert.strictEqual(debugVal, false, "The value is correct");
		assert.strictEqual(infoVal, true, "The value is correct");
	});
});