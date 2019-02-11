const Log = require('./index');
const log = new Log('Demo File', '1.0.1');

log.info('Testing how an info line looks');
log.dir({'msg': 'Testing how a dir line looks'});
log.error('Testing how an error line looks');