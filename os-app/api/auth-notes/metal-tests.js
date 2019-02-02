/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal');

const kTesting = {
	StubValidNote: function() {
		return {
			WKCNoteBody: 'alfa',
		};
	},
};

describe('WKCNotesMetalCreate', function testWKCNotesMetalCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns inputData with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidNote(), {
			WKCNoteBody: null,
		}))).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		
		assert.deepEqual(item, Object.assign(kTesting.StubValidNote(), {
			WKCNoteID: item.WKCNoteID,
			WKCNoteDateCreated: item.WKCNoteDateCreated,
			WKCNoteDateUpdated: item.WKCNoteDateUpdated,
		}));
		assert.strictEqual(parseInt(item.WKCNoteID) - (new Date()) > -500, true);
	});

});

describe('WKCNotesMetalRead', function testWKCNotesMetalRead() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesMetalRead(WKCTestingMongoClient, 1), /WKCErrorInvalidInput/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalRead(WKCTestingMongoClient, 'alfa'), null);
	});

	it('returns WKCNote', async function() {
		let item = await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		assert.deepEqual(await mainModule.WKCNotesMetalRead(WKCTestingMongoClient, item.WKCNoteID), item);
	});

});

describe('WKCNotesMetalUpdate', function testWKCNotesMetalUpdate() {

	it('rejects if param2 not string', async function() {
		await assert.rejects(mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, 1, {}), /WKCErrorInvalidInput/);
	});

	it('rejects if param3 not object', async function() {
		await assert.rejects(mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, '1', null), /WKCErrorInvalidInput/);
	});

	it('returns null if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, 'alfa', kTesting.StubValidNote()), null);
	});

	it('returns inputData with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, (await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote())).WKCNoteID, {
			WKCNoteBody: null,
		})).WKCErrors, {
			WKCNoteBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCNote with updates', async function() {
		let itemCreated = await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote());
		let itemUpdated = await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, itemCreated.WKCNoteID, {
			WKCNoteBody: 'bravo',
		});

		assert.deepEqual(itemUpdated, Object.assign(itemCreated, {
			WKCNoteBody: 'bravo',
			WKCNoteDateUpdated: itemUpdated.WKCNoteDateUpdated,
		}));
	});

	it('validates only present fields', async function() {
		assert.deepEqual((await mainModule.WKCNotesMetalUpdate(WKCTestingMongoClient, (await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote())).WKCNoteID, {
			WKCNotePublishStatusIsPublished: 'true',
		})).WKCErrors, {
			WKCNotePublishStatusIsPublished: [
				'WKCErrorNotBoolean',
			],
		});
	});

});

describe('WKCNotesMetalDelete', function testWKCNotesMetalDelete() {

	it('rejects if not string', async function() {
		await assert.rejects(mainModule.WKCNotesMetalDelete(WKCTestingMongoClient, 1), /WKCErrorInvalidInput/);
	});

	it('returns error if not found', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalDelete(WKCTestingMongoClient, 'alfa'), new Error('WKCErrorNotFound'))
	});

	it('returns true', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalDelete(WKCTestingMongoClient, (await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, kTesting.StubValidNote())).WKCNoteID), true);
	});

});

describe('WKCNotesMetalQuery', function testWKCNotesMetalQuery() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCNotesMetalQuery(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns array if no results', async function() {
		assert.deepEqual(await mainModule.WKCNotesMetalQuery(WKCTestingMongoClient, {}), []);
	});

	it('returns array if results', async function() {
		let items = await Promise.all(['alfa', 'bravo'].map(async function (e) {
			return await mainModule.WKCNotesMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.StubValidNote(), {
				WKCNoteBody: e,
			}));
		}));

		assert.deepEqual(await mainModule.WKCNotesMetalQuery(WKCTestingMongoClient, {}), items.reverse());
	});

});
