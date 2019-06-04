const {init} = require("../index");

const log = init("My Test Module", "1.0.0");

log.info("Testing", "foo", "bar");
log.debug("Testing", "foo", "bar");
log.warn("Testing", "foo", "bar");
log.error("Testing", "foo", "bar");
