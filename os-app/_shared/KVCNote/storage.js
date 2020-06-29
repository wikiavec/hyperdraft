import KVCNoteModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const kCollection = 'kvc_notes';

const mod = {

	uFakeNote (inputData) {
		return {
			KVCNoteID: inputData.split('/')[2],
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date(inputData.split('/')[1]),
			KVCNoteModificationDate: new Date(),
		};
	},

	KVCNoteStorageCollectionType () {
		return 'kvc_note';
	},

	KVCNoteStorageCollectionPath () {
		return kCollection + '/';
	},

	KVCNoteStorageFolderPath (inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCNoteStorageCollectionPath() + inputData.KVCNoteCreationDate.toJSON().split('T').shift() + '/' + inputData.KVCNoteID + '/';

		return mod.KVCNoteStorageCollectionPath() + inputData + '/';
	},

	KVCNoteStorageObjectPath (inputData) {
		return mod.KVCNoteStorageFolderPath(inputData) + 'main';
	},

	KVCNoteStorageObjectPathV1 (inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCNoteStorageCollectionPath() + inputData.KVCNoteID;
	},

	KVCNoteStorageMatchV1 (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const item = {
			KVCNoteID: inputData.split('/')[1],
			KVCNoteBody: '',
			KVCNoteCreationDate: new Date(),
			KVCNoteModificationDate: new Date(),
		};

		return inputData === mod.KVCNoteStorageObjectPathV1(item);
	},

	KVCNoteStorageMatch (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const item = mod.uFakeNote(inputData);

		if (KVCNoteModel.KVCNoteModelErrorsFor(item)) {
			return false;
		}

		return inputData === mod.KVCNoteStorageObjectPath(item);
	},

	KVCNoteStorageBuild (privateClient, publicClient, changeDelegate) {
		privateClient.on('change', function (event) {
			if (!changeDelegate) {
				return;
			}
			
			const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

			if (!delegateMethod) {
				return;
			}

			if (typeof changeDelegate[delegateMethod] !== 'function') {
				return console.warn(`${ delegateMethod } not function`);
			}

			if (!mod.KVCNoteStorageMatch(event.relativePath)) {
				return;
			}

			if (event.origin === 'remote' && event.oldValue && event.newValue) {
				// #hotfix-remotestorage-remote-event-from-local-change
				if (JSON.stringify(event.oldValue) === JSON.stringify(event.newValue)) {
					return console.info('RemoteIdentical', event);
				}
			}

			changeDelegate[delegateMethod](OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
		});

		const OLSKRemoteStorageCollectionExports = {

			async KVCStorageList () {
				return (await Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListObjectsRecursive(privateClient, mod.KVCNoteStorageCollectionPath())).filter(mod.KVCNoteStorageMatch).map(function (e) {
					return privateClient.getObject(e, false);
				}))).reduce(function (coll, item) {
					if (item) {
						coll[item.KVCNoteID] = item;
					}

					return coll;
				}, {});
			},

			async KVCStorageWrite (inputData) {
				await privateClient.storeObject(mod.KVCNoteStorageCollectionType(), mod.KVCNoteStorageObjectPath(inputData), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(inputData));
				return OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData);
			},
			
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCNoteStorageObjectPath(inputData));
			},

			async KVCStorageMigrateNotesV1 (inputData) {
				return Promise.all((await OLSKRemoteStorage.OLSKRemoteStorageListObjectsRecursive(privateClient, mod.KVCNoteStorageCollectionPath())).filter(mod.KVCNoteStorageMatchV1).map(async function (e) {
					const item = OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await privateClient.getObject(e, false));
					
					inputData(await OLSKRemoteStorageCollectionExports.KVCStorageWrite(item));

					await privateClient.remove(e);

					return item;
				}));
			},

		};

		return {
			OLSKRemoteStorageCollectionName: kCollection,
			OLSKRemoteStorageCollectionType: mod.KVCNoteStorageCollectionType(),
			OLSKRemoteStorageCollectionModelErrors: Object.entries(KVCNoteModel.KVCNoteModelErrorsFor({}, {
				KVCOptionValidateIfNotPresent: true,
			})).map(function (e) {
				if (!Object.keys(KVCNoteModel.KVCNoteModelErrorsFor({})).includes(e[0])) {
					e[1].push('__RSOptional');
				}

				return e;
			}).reduce(function (coll, item) {
				coll[item[0]] = item[1];

				return coll;
			}, {}),
			OLSKRemoteStorageCollectionExports,
		};
	},

};

export default mod;
