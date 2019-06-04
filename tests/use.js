const {init} = require("../index");

const log1 = init("Module1", "1.0.0");

log1.info("Testing", "foo", "bar");
log1.debug("Testing", "foo", "bar");
log1.warn("Testing", "foo", "bar");
log1.error("Testing", "foo", "bar");

const log2 = init("Module2", "1.0.0", {debug: true});

log2.info("Testing", "foo", "bar");
log2.debug("Testing", "foo", "bar");
log2.warn("Testing", "foo", "bar");
log2.error("Testing", "foo", "bar");