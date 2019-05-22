const assert = require("assert");
const {env} = require("../index");
const {getLevel} = require("../index");

describe("env()", () => {
	it("Will correctly set levels based on single text in the the env var", () => {
		process.env.LOG_LEVEL_FOO = 'debug';
		
		env("LOG_LEVEL_FOO");
		
		const debugVal = getLevel("debug");
		
		assert.strictEqual(debugVal, true, "The value is correct");
	});
	
	it("Will correctly disable levels based on single text in the the env var", () => {
		process.env.LOG_LEVEL_FOO = '!debug';
		
		env("LOG_LEVEL_FOO");
		
		const debugVal = getLevel("debug");
		
		assert.strictEqual(debugVal, false, "The value is correct");
	});
	
	it("Will correctly set levels based on array JSON in the the env var", () => {
		process.env.LOG_LEVEL_FOO = '["debug", "!info"]';
		
		env("LOG_LEVEL_FOO");
		
		const debugVal = getLevel("debug");
		const infoVal = getLevel("info");
		
		assert.strictEqual(debugVal, true, "The value is correct");
		assert.strictEqual(infoVal, false, "The value is correct");
	});
	
	it("Will correctly set levels based on object JSON in the the env var", () => {
		process.env.LOG_LEVEL_FOO = '{"debug": true, "info": false}';
		
		env("LOG_LEVEL_FOO");
		
		const debugVal = getLevel("debug");
		const infoVal = getLevel("info");
		
		assert.strictEqual(debugVal, true, "The value is correct");
		assert.strictEqual(infoVal, false, "The value is correct");
	});
});