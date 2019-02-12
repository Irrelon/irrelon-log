const Log = require('./index');
const log = new Log('demoOther');

const start = () => {
	log.info('Hello from another module');
};

module.exports = {
	start
};