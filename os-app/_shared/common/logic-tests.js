const { throws, deepEqual } = require('assert');

const mainModule = require('./logic.js');

describe('WKCSharedDonateLinkGuard', function testWKCSharedDonateLinkGuard() {

	const StubEnvValid = function () {
		return {
			KVC_SHARED_DONATE_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.WKCSharedDonateLinkGuard(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns error if no KVC_SHARED_DONATE_URL', function () {
		deepEqual(mainModule.WKCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_DONATE_URL: null,
		})), new Error('KVC_SHARED_DONATE_URL not defined'));
	});

	it('returns error if KVC_SHARED_DONATE_URL blank', function () {
		deepEqual(mainModule.WKCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_DONATE_URL: ' ',
		})), new Error('KVC_SHARED_DONATE_URL not defined'));
	});

});

describe('WKCSharedGitHubLinkGuard', function testWKCSharedGitHubLinkGuard() {

	const StubEnvValid = function () {
		return {
			KVC_SHARED_GITHUB_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.WKCSharedGitHubLinkGuard(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns error if no KVC_SHARED_GITHUB_URL', function () {
		deepEqual(mainModule.WKCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_GITHUB_URL: null,
		})), new Error('KVC_SHARED_GITHUB_URL not defined'));
	});

	it('returns error if KVC_SHARED_GITHUB_URL blank', function () {
		deepEqual(mainModule.WKCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_GITHUB_URL: ' ',
		})), new Error('KVC_SHARED_GITHUB_URL not defined'));
	});

});
