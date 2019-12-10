const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

describe('KVCWriteEditorLineObjectsFor', function testKVCWriteEditorLineObjectsFor() {

	it('throws error if not array', function() {
		throws(function() {
			mainModule.KVCWriteEditorLineObjectsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor([]), []);
	});

	it('converts non-link single', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('alfa')), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'variable-2',
		}]);
	});

	it('converts non-link multiple', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('alfa bravo')), [{
			start: 0,
			end: 10,
			string: 'alfa bravo',
			type: 'variable-2',
		}]);
	});

	it('converts link single', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('[[alfa]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts link multiple', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('[[alfa]] [[bravo]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}, {
			start: 8,
			end: 9,
			string: ' ',
			type: 'variable-2',
		}, {
			start: 9,
			end: 18,
			string: '[[bravo]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts header', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('# alfa')), [{
			start: 0,
			end: 6,
			string: '# alfa',
			type: 'header header-1',
		}]);
	});

	it('converts multiple header objects', function() {
		deepEqual(mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('# alfa [[bravo]]')), [{
			start: 0,
			end: 7,
			string: '# alfa ',
			type: 'header header-1',
		}, {
			start: 7,
			end: 16,
			string: '[[bravo]]',
			type: 'header header-1 link',
		}]);
	});

});

describe('KVCWriteEditorHeaderTokensFrom', function testKVCWriteEditorHeaderTokensFrom() {

	it('throws error if not array', function() {
		throws(function() {
			mainModule.KVCWriteEditorHeaderTokensFrom(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.KVCWriteEditorHeaderTokensFrom([]), []);
	});

	it('excludes if not header', function() {
		deepEqual(mainModule.KVCWriteEditorHeaderTokensFrom([
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('alfa')),
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('[[bravo]]')),
		]), []);
	});

	it('includes if header', function() {
		deepEqual(mainModule.KVCWriteEditorHeaderTokensFrom([
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('# alfa')),
		]), mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('# alfa')).map(function (e) {
			return Object.assign(e, {
				line: 0,
			});
		}));
	});

	it('excludes if not verbal', function() {
		deepEqual(mainModule.KVCWriteEditorHeaderTokensFrom([
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('alfa')),
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('====')),
		].map(function (e) {
			return e.map(function (e) {
				return Object.assign(e, {
					type: 'header header-1',
				});
			});
		})), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'header header-1',
			line: 0,
		}]);
	});

	it('merges multiple header objects', function() {
		deepEqual(mainModule.KVCWriteEditorHeaderTokensFrom([
			mainModule.KVCWriteEditorLineObjectsFor(mainModule.uStubLineTokensFor('# PA PARC https://www.supermarchepa.com/pages/weekly-flyer')),
		]), [{
			start: 0,
			end: 58,
			string: '# PA PARC https://www.supermarchepa.com/pages/weekly-flyer',
			type: 'header header-1',
			line: 0,
		}]);
	});

});