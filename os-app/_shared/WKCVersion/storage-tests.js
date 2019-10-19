import { throws, deepEqual } from 'assert';

import * as mainModule from './storage.js';

describe('WKCVersionStoragePath', function testWKCVersionStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.WKCVersionStoragePath('alfa'), 'wkc_versions/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.WKCVersionStoragePath(''), 'wkc_versions/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.WKCVersionStoragePath(), 'wkc_versions/');
	});

});