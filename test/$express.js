'use strict';

/**
 * AMNA: Amazing Mongoose Node.js API
 *
 * @author Nate Ferrero
 * @url https://github.com/NateFerrero/amna
 *
 * AMNA Tests - Express
 */
var expect = require('chai').expect;
var amna = require('../src/index.js');

describe('$express', function () {

    it ('exists', function () {
        expect(amna.$express).to.be.defined;
    });

});
