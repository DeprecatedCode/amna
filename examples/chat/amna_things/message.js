var amna = require('../../../src/index.js');

var Message = module.exports = amna.thing.mongoose({

	author: String,
	body: String,
	time: Date
})