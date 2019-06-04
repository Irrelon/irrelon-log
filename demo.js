const {init: initLog} = require('./index');
const log = initLog('Demo File', '1.0.1', {
	debug: true,
	info: true,
	warn: true,
	error: true
});
const otherModule = require('./demoOther.js');

log.debug('Testing how a debug line looks');
log.info('Testing how an info line looks');
log.warn('Testing how a warn line looks');
log.error('Testing how an error line looks');

otherModule.start();