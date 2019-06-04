const {init: initLog} = require('./index');
const log = initLog('demoOther', {
	debug: true,
	info: true,
	warn: true,
	error: true
});

const start = () => {
	log.info('Hello from another module without a version');
};

module.exports = {
	start
};