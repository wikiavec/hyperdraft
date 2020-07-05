const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCTemplate: 'html',
	KVCTemplateHead: 'html head',
	KVCTemplateHeadTitle: 'html head title',
	KVCTemplateHeadStyle: 'html head style',
	KVCTemplateBody: 'html body',
	KVCArticleTitle: '.KVCArticleTitle',
	KVCArticleBody: '.KVCArticleBody',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCTemplate_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows KVCTemplate', function() {
		browser.assert.elements(KVCTemplate, 1);
	});

	it('shows KVCTemplateHead', function () {
		browser.assert.elements(KVCTemplateHead, 1);
	});

	it('shows KVCTemplateHeadTitle', function () {
		browser.assert.elements(KVCTemplateHeadTitle, 1);
	});

	it('shows KVCTemplateHeadStyle', function () {
		browser.assert.elements(KVCTemplateHeadStyle, 1);
	});

	it('shows KVCTemplateBody', function () {
		browser.assert.elements(KVCTemplateBody, 1);
	});

	it('shows KVCArticleTitle', function () {
		browser.assert.elements(KVCArticleTitle, 1);
	});

	it('shows KVCArticleBody', function () {
		browser.assert.elements(KVCArticleBody, 1);
	});

});
