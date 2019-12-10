/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var mongodbPackage = require('mongodb');

const modelLibrary = require('./model.js');

//_ WKCMetalArticlesCreate

exports.WKCMetalArticlesCreate = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (!modelLibrary.WKCModelInputDataIsArticleObject(modelLibrary.WKCModelArticlePrepare(inputData))) {
		return completionHandler(null, inputData);
	}

	var currentDate = new Date();

	return databaseClient.db(process.env.KVC_SHARED_DATABASE_NAME).collection('wkc_articles').insertOne(Object.assign(inputData, {
		WKCArticleDateCreated: currentDate,
		WKCArticleDateUpdated: currentDate,
	}), function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		var articleObject = Object.assign(result.ops.slice(-1).pop(), {
			WKCArticleID: result.ops.slice(-1).pop()._id.toString(),
		});

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesRead

exports.WKCMetalArticlesRead = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('KVCErrorInputNotValid');
	}

	return databaseClient.db(process.env.KVC_SHARED_DATABASE_NAME).collection('wkc_articles').findOne({
		_id: mongodbPackage.ObjectID(inputData),
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result) {
			return completionHandler(new Error('KVCErrorNotFound'));
		}

		var articleObject = Object.assign(result, {
			WKCArticleID: result._id.toString(),
		});

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesUpdate

exports.WKCMetalArticlesUpdate = function(databaseClient, inputData1, inputData2, completionHandler) {
	if (typeof inputData1 !== 'string') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof inputData2 !== 'object' || inputData2 === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (!modelLibrary.WKCModelInputDataIsArticleObject(modelLibrary.WKCModelArticlePrepare(inputData2), {
		WKCOptionValidatePresentOnly: true,
	})) {
		return completionHandler(null, inputData2);
	}

	return databaseClient.db(process.env.KVC_SHARED_DATABASE_NAME).collection('wkc_articles').findOneAndUpdate({
		_id: mongodbPackage.ObjectID(inputData1),
	}, {
		'$set': Object.assign(inputData2, {
			WKCArticleDateUpdated: new Date(),
		}),
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.value) {
			return completionHandler(new Error('KVCErrorNotFound'));
		}

		var articleObject = Object.assign(result.value, inputData2);

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesDelete

exports.WKCMetalArticlesDelete = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('KVCErrorInputNotValid');
	}

	return databaseClient.db(process.env.KVC_SHARED_DATABASE_NAME).collection('wkc_articles').deleteOne({
		_id: mongodbPackage.ObjectID(inputData),
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.result.n) {
			return completionHandler(new Error('KVCErrorNotFound'));
		}

		return completionHandler(null, true);
	});
};

//_ WKCMetalArticlesSearch

exports.WKCMetalArticlesSearch = function(databaseClient, inputData, completionHandler, options) {
	if (typeof completionHandler !== 'function') {
		throw new Error('KVCErrorInputNotValid');
	}

	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	if (options && typeof options !== 'object' || options === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	if (options && options.WKCOptionLimit && parseInt(options.WKCOptionLimit) !== options.WKCOptionLimit) {
		throw new Error('KVCErrorInputNotValid');
	}

	return databaseClient.db(process.env.KVC_SHARED_DATABASE_NAME).collection('wkc_articles').find(inputData
	// {
	// 		WKCArticleIsArchived: {
	// 			'$ne': true,
	// 		},
	// 		WKCArticleIsDiscarded: {
	// 			'$ne': true,
	// 		},
	// 	}
	// ).project(modelLibrary.WKCArticleHiddenPropertyNames().reduce(function(hash, e) {
	// 	hash[e] = 0;
		
	// 	return hash;
	// }, {})
	).limit(options && options.WKCOptionLimit ? options.WKCOptionLimit : 0).sort({
		WKCArticleDateCreated: -1,
	}).toArray(function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		return completionHandler(null, result.map(function(e) {
			e.WKCArticleID = e._id.toString();

			modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
				delete e[obj];
			});

			return e;
		}));
	});
};
