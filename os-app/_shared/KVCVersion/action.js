import * as KVCVersionMetal from './metal.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const KVCVersionActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await KVCVersionMetal.KVCVersionMetalWrite(storageClient, Object.assign(inputData, {
		KVCVersionID: uniqueID(),
	}));
};

export const KVCVersionActionDelete = async function(storageClient, inputData) {
	return await KVCVersionMetal.KVCVersionMetalDelete(storageClient, inputData);
};

export const KVCVersionActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await KVCVersionMetal.KVCVersionMetalList(storageClient)).sort(function (a, b) {
		return b.KVCVersionDate - a.KVCVersionDate;
	}).filter(function(e) {
		if (!Object.keys(inputData).length) {
			return true;
		}

		if (Object.keys(inputData).filter(function (key) {
			return e[key].match(inputData[key]);
		}).length) {
			return true;
		}

		return false;
	}));
};
