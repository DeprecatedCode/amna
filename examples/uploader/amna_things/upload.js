var amna = require('../../../src/index.js');

var Upload = module.exports = amna.thing.mongoose({
	name: String,
	time: Date
});
