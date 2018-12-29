/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKSubscriptions = global.WKSubscriptions || {})));
}(this, (function (exports) { 'use strict';

	var moi = {};

	var WKSubscriptionsPropertyAPIToken;
	var WKSubscriptionsPropertySubscriptionObjects;
	var WKSubscriptionsPropertySubscriptionObjectsByID;
	var WKSubscriptionsPropertySelectedArticle;
	var kWKCSubscriptionsOutlookInbox;
	var kWKCSubscriptionsOutlookArchived;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertyAPIToken;
		}

		WKSubscriptionsPropertyAPIToken = inputData;
	};

	//_ propertiesOutlookObjects

	moi.propertiesOutlookObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('#WKCSubscriptionsSourcesContentListOutlooksList .WKCSubscriptionsSourcesContentListChildListItem').data();
		}

		moi.reactOutlookObjects(inputData);
	};

	//_ propertiesSubscriptionObjects

	moi.propertiesSubscriptionObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySubscriptionObjects;
		}

		moi.reactSubscriptionObjects(inputData);

		moi._propertiesSubscriptionObjectsByID((WKSubscriptionsPropertySubscriptionObjects = inputData).reduce(function(map, e) {
			map[e.WKCSubscriptionID] = e;
			return map;
		}, {}));
	};

	//_ _propertiesSubscriptionObjectsByID

	moi._propertiesSubscriptionObjectsByID = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySubscriptionObjectsByID;
		}

		WKSubscriptionsPropertySubscriptionObjectsByID = inputData;
	};

	//_ propertiesArticleObjects

	moi.propertiesArticleObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCSubscriptionsMasterContentListItem').data();
		}

		moi.reactArticleObjects(inputData);
	};

	//_ propertiesSelectedArticle

	moi.propertiesSelectedArticle = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySelectedArticle;
		}

		WKSubscriptionsPropertySelectedArticle = inputData === null ? undefined : inputData;

		moi.reactSelectedArticle();
	};

	//# INTERFACE

	//_ interfaceSubscriptionsCreateButtonDidClick

	moi.interfaceSubscriptionsCreateButtonDidClick = function () {
		moi.commandsSubscriptionsCreate();
	};

	//_ interfaceSubscriptionsCreateCloseButtonDidClick

	moi.interfaceSubscriptionsCreateCloseButtonDidClick = function () {
		moi.commandsSubscriptionsCreateClose();
	};

	//_ interfaceArticlesArchiveButtonDidClick

	moi.interfaceArticlesArchiveButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesArchive(moi.propertiesSelectedArticle());
	};

	//_ interfaceArticlesDiscardButtonDidClick

	moi.interfaceArticlesDiscardButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesDiscard(moi.propertiesSelectedArticle());
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertSubscriptionsUnavailable

	moi.commandsAlertSubscriptionsUnavailable = function () {
		window.alert(OLSKLocalized('WKCSubscriptionsErrorSubscriptionsUnavailableText'));

		throw new Error('WKCSubscriptionsErrorSubscriptionsUnavailable');
	};

	//_ commandsAlertArticlesUnavailable

	moi.commandsAlertArticlesUnavailable = function () {
		window.alert(OLSKLocalized('WKCSubscriptionsErrorArticlesUnavailableText'));

		throw new Error('WKCSubscriptionsErrorArticlesUnavailable');
	};

	//_ commandsSubscriptionsCreate

	moi.commandsSubscriptionsCreate = function () {
		moi.reactSubscriptionsCreateVisibility(true);
	};

	//_ commandsSubscriptionsCreateClose

	moi.commandsSubscriptionsCreateClose = function () {
		moi.reactSubscriptionsCreateVisibility(false);
	};

	//_ commandsSelectArticle

	moi.commandsSelectArticle = function (item) {
		moi.propertiesSelectedArticle(item);

		if (!item) {
			return;
		}

		if (item.WKCArticleIsRead) {
			return;
		}

		moi.commandsArticlesMarkAsRead(item);
	};

	//_ commandsArticlesMarkAsRead

	moi.commandsArticlesMarkAsRead = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsRead: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			d3.selectAll('.WKCSubscriptionsMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCSubscriptionsMasterContentListItemUnread', false);

			moi.reactSourcesUnreadCount();
		}, moi.commandsArticlesAlertErrorMarkAsRead);
	};

	//_ commandsArticlesAlertErrorMarkAsRead

	moi.commandsArticlesAlertErrorMarkAsRead = function () {
		window.alert(OLSKLocalized('WKCSubscriptionsErrorArticlesMarkAsReadText'));

		throw new Error('WKCSubscriptionsErrorArticlesMarkAsRead');
	};

	//_ commandsArticlesDiscard

	moi.commandsArticlesDiscard = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsDiscarded: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle();

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.commandsSelectArticle(nextArticle);
		}, moi.commandsArticlesAlertErrorMarkAsDiscarded);
	};

	//_ commandsArticlesAlertErrorMarkAsDiscarded

	moi.commandsArticlesAlertErrorMarkAsDiscarded = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsErrorArticlesMarkAsDiscardedText'));

		throw error;
	};

	//_ commandsArticlesArchive

	moi.commandsArticlesArchive = function (item) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesUpdate', {
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsArchived: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			var nextArticle = moi.utilitiesNextArticle()

			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));

			moi.commandsSelectArticle(nextArticle);
		}, moi.commandsArticlesAlertErrorMarkAsArchived);
	};

	//_ commandsArticlesAlertErrorMarkAsArchived

	moi.commandsArticlesAlertErrorMarkAsArchived = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsErrorArticlesMarkAsArchivedText'));

		throw error;
	};

	//_ commandsSourcesSelect

	moi.commandsSourcesSelect = function (inputData) {
		moi.reactSourcesSelectedSource(inputData);
	};

	//# REACT

	//_ reactOutlookObjects

	moi.reactOutlookObjects = function (outlookObjects) {
		var selection = d3.select('#WKCSubscriptionsSourcesContentListOutlooksList').selectAll('.WKCSubscriptionsSourcesContentListChildListItem').data(outlookObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('id', function (obj) {
					return obj.WKCOutlookID
				})
				.classed('WKCSubscriptionsSourcesContentListChildListItem', true)
				.classed('WKCSharedElementTappable', true)
				.on('click', moi.commandsSourcesSelect);

		parentElement.append('img');

		parentElement.append('span')
			.classed('WKCSubscriptionsSourcesContentListChildListItemName', true)
			.classed('WKCSubscriptionsText', true);

		parentElement.append('span')
			.attr('class', 'WKCSubscriptionsSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCSubscriptionsText', true);

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCSubscriptionsSourcesContentListChildListItemName').text(function(obj) {
			return obj.WKCOutlookText;
		});

		parentElement.select('img').attr('src', function (e) {
			return 'data:image/svg+xml;base64,' + new Identicon(md5(e.WKCOutlookID), {
				margin: 0.2,
				size: 20,
				format: 'svg',
				foreground: [0, 0, 0, 255],
				background: [0, 0, 0, 0],
		  }).toString();
		});

		selection.exit().remove();
	};

	//_ reactSourcesSelectedSource

	moi.reactSourcesSelectedSource = function (inputData) {
		d3.selectAll('.WKCSubscriptionsSourcesContentListChildListItem')
			.classed('WKCSubscriptionsSourcesContentListChildListItemSelected', function (obj) {
				return obj === inputData;
			});
	};

	//_ reactSubscriptionObjects

	moi.reactSubscriptionObjects = function (subscriptionObjects) {
		var selection = d3.select('#WKCSubscriptionsSourcesContentListSubscriptionsList')
			.selectAll('.WKCSubscriptionsSourcesContentListChildListItem').data(subscriptionObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsSourcesContentListChildListItem')
				.classed('WKCSharedElementTappable', true)
				.on('click', moi.commandsSourcesSelect);

		parentElement.append('img')
			.classed('WKCSubscriptionsText', true);

		parentElement.append('span')
			.attr('class', 'WKCSubscriptionsSourcesContentListChildListItemName');

		parentElement.append('span')
			.attr('class', 'WKCSubscriptionsSourcesContentListChildListItemUnreadCount')
			.append('span')
				.classed('WKCSubscriptionsText', true);

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCSubscriptionsSourcesContentListChildListItemName').text(function(obj) {
			return obj.WKCSubscriptionName;
		});

		parentElement.select('img').attr('src', function (e) {
			return 'data:image/svg+xml;base64,' + new Identicon(md5(e.WKCSubscriptionURL), {
				margin: 0.2,
				size: 20,
				format: 'svg',
				foreground: [0, 0, 0, 255],
				background: [0, 0, 0, 0],
		  }).toString();
		});

		moi.reactSourcesUnreadCount();

		selection.exit().remove();
	};

	//_ reactArticleObjects

	moi.reactArticleObjects = function (articleObjects) {
		var selection = d3.select('#WKCSubscriptionsMasterContent')
			.selectAll('.WKCSubscriptionsMasterContentListItem').data(articleObjects);
		
		var parentElement = selection.enter()
			.append('div')
				.attr('class', 'WKCSubscriptionsMasterContentListItem')
				.classed('WKCSharedElementTappable', true);
		var contextElement = parentElement.append('div').attr('class', 'WKCSubscriptionsMasterContentListItemContext');

		contextElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemReadStatus').text('⚫︎');
		contextElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemContextSource');
		contextElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemContextTiming');

		parentElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemHeadline');
		parentElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemSnippet');

		parentElement = parentElement.merge(selection);

		parentElement
			.classed('WKCSubscriptionsMasterContentListItemUnread', function(obj) {
				return !obj.WKCArticleIsRead;
			})
			.on('click', moi.commandsSelectArticle);
		parentElement.select('.WKCSubscriptionsMasterContentListItemHeadline').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemSnippet').text(function(obj) {
			var textarea = document.createElement('textarea');
			
			textarea.innerHTML = obj.WKCArticleSnippet || 'no_snippet';

			var div = document.createElement('div');
			div.innerHTML = textarea.value;

			return div.innerText;
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemContextSource').text(function(obj) {
			return moi._propertiesSubscriptionObjectsByID()[obj.WKCArticleSubscriptionID].WKCSubscriptionName;
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemContextTiming').text(function(obj) {
			return moment(obj.WKCArticlePublishDate).calendar(null, {
				sameDay: 'hh:mm',
				lastDay: '[Yesterday]',
				lastWeek: 'dddd',
				sameElse: 'YYYY-MM-DD'
			});
		});

		selection.exit().remove();
	};

	//_ reactSubscriptionsCreateVisibility

	moi.reactSubscriptionsCreateVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsCreate').classed('WKCSubscriptionsCreateActive', isVisible);
		d3.select('#WKCSubscriptionsCreate').classed('WKCSubscriptionsCreateInactive', !isVisible);
	};

	//_ reactSourcesUnreadCount

	moi.reactSourcesUnreadCount = function () {
		d3.select('#WKCSubscriptionsSourcesContentListOutlooksListItemInbox .WKCSubscriptionsSourcesContentListChildListItemUnreadCount')
			.classed('WKCSubscriptionsHidden', !moi.propertiesArticleObjects().filter(function (e) {
				return !e.WKCArticleIsRead;
			}).length)
			.select('.WKCSubscriptionsText')
				.text(moi.propertiesArticleObjects().filter(function (e) {
					return !e.WKCArticleIsRead;
				}).length);

		d3.selectAll('#WKCSubscriptionsSourcesContentListSubscriptionsList .WKCSubscriptionsSourcesContentListChildListItemUnreadCount')
			.classed('WKCSubscriptionsHidden', function(obj) {
				return !moi.propertiesArticleObjects().filter(function (e) {
					if (e.WKCArticleSubscriptionID !== obj.WKCSubscriptionID) {
						return false;
					}

					if (e.WKCArticleIsRead) {
						return false;
					}

					return true;
				}).length;
			})
			.select('.WKCSubscriptionsText')
				.text(function(obj) {
					return moi.propertiesArticleObjects().filter(function (e) {
						if (e.WKCArticleSubscriptionID !== obj.WKCSubscriptionID) {
							return false;
						}

						if (e.WKCArticleIsRead) {
							return false;
						}

						return true;
					}).length;
				});
	};

	//_ reactSelectedArticle

	moi.reactSelectedArticle = function () {
		d3.selectAll('.WKCSubscriptionsMasterContentListItem').classed('WKCSubscriptionsMasterContentListItemSelected', function(obj) {
			return obj === moi.propertiesSelectedArticle();
		});

		if (!moi.propertiesSelectedArticle()) {
			return d3.select('#WKCSubscriptionsDetail').classed('WKCSubscriptionsDetailInactive', true);
		}

		d3.select('#WKCSubscriptionsDetailContentHeading').text(moi.propertiesSelectedArticle().WKCArticleTitle || 'untitled_article');
		d3.select('#WKCSubscriptionsDetailContentAuthor').text(moi.propertiesSelectedArticle().WKCArticleAuthor || 'no_author');
		d3.select('#WKCSubscriptionsDetailContentDate').text(moment(moi.propertiesSelectedArticle().WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'));
		d3.select('#WKCSubscriptionsDetailContentSource').text(moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionName);
		d3.select('#WKCSubscriptionsDetailContentLink').attr('href', moi.propertiesSelectedArticle().WKCArticleOriginalURL || moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionURL);
		d3.select('#WKCSubscriptionsDetailContentBody')
			.html((function(inputData) {
				var textarea = document.createElement('textarea');
				
				textarea.innerHTML = moi.propertiesSelectedArticle().WKCArticleBody;

				return textarea.value;
			})(moi.propertiesSelectedArticle().WKCArticleBody))
			.classed('WKCSubscriptionsDetailContentBodyFile', moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionType === 'File');

		d3.selectAll('#WKCSubscriptionsDetailContentBody a').attr('target', '_blank');

		d3.selectAll('#WKCSubscriptionsDetailContentBody *').each(function (a, b, c) {
			if (!d3.select(this).attr('width')) {
				return null;
			}

			d3.select(this)
				.attr('width', null)
				.style('max-width', '100%')
				.style('height', 'auto');
		});

		d3.select('#WKCSubscriptionsDetail').classed('WKCSubscriptionsDetailInactive', false);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupSubscriptionObjects(function() {
				moi.setupArticleObjects(function() {
					moi.setupSourceList();
					
					d3.select('#WKCSubscriptions').classed('WKCSubscriptionsLoading', false);
				});
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIToken'), {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupSubscriptionObjects

	moi.setupSubscriptionObjects = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsSearch'), {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertSubscriptionsUnavailable();
			}

			moi.propertiesSubscriptionObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCSubscriptionDateCreated: new Date(e.WKCSubscriptionDateCreated),
					WKCSubscriptionDateUpdated: new Date(e.WKCSubscriptionDateUpdated),
					WKCSubscriptionFetchDate: new Date(e.WKCSubscriptionFetchDate),
				});
			}));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupArticleObjects

	moi.setupArticleObjects = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIArticlesSearch'), {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertArticlesUnavailable();
			}

			moi.propertiesArticleObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCArticlePublishDate: new Date(e.WKCArticlePublishDate),
				});
			}).sort(WKSubscriptionsLogic.WKSubscriptionsListSort));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupSourceList

	moi.setupSourceList = function () {
		// browser quirks: call OLSKLocalized after package is loaded
		kWKCSubscriptionsOutlookInbox = {
			WKCOutlookID: 'WKCSubscriptionsSourcesContentListOutlooksListItemInbox',
			WKCOutlookText: OLSKLocalized('WKCSubscriptionsSourcesContentListItemInboxText'),
			WKCOutlookData: {},
		};
		kWKCSubscriptionsOutlookArchived = {
			WKCOutlookID: 'WKCSubscriptionsSourcesContentListOutlooksListItemArchived',
			WKCOutlookText: OLSKLocalized('WKCSubscriptionsSourcesContentListItemArchivedText'),
			WKCOutlookData: {},
		};
		
		moi.propertiesOutlookObjects([
			kWKCSubscriptionsOutlookInbox,
			kWKCSubscriptionsOutlookArchived,
		]);

		moi.propertiesSubscriptionObjects(moi.propertiesSubscriptionObjects());

		moi.commandsSourcesSelect(kWKCSubscriptionsOutlookInbox);
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	//# UTILITIES

	//_ utilitiesNextArticle

	moi.utilitiesNextArticle = function () {
		var currentIndex = moi.propertiesArticleObjects().indexOf(moi.propertiesSelectedArticle());

		if (currentIndex < (moi.propertiesArticleObjects().length - 1)) {
			return moi.propertiesArticleObjects()[currentIndex + 1];
		}

		if (moi.propertiesArticleObjects().length > 1) {
			return moi.propertiesArticleObjects()[currentIndex - 1]
		}
		
		return null;
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
