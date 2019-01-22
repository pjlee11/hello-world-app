/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "44c0acf579ea4ed1e9ca";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../simorgh-renderer/src/client.js":
/*!*****************************************!*\
  !*** ../simorgh-renderer/src/client.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"react\");\n\nvar _react2 = _interopRequireDefault(_react);\n\n__webpack_require__(/*! babel-polyfill */ \"babel-polyfill\");\n\nvar _reactDom = __webpack_require__(/*! react-dom */ \"react-dom\");\n\nvar _reactUniversalApp = __webpack_require__(/*! react-universal-app */ \"react-universal-app\");\n\nvar _runtime = __webpack_require__(/*! offline-plugin/runtime */ \"offline-plugin/runtime\");\n\nvar OfflinePluginRuntime = _interopRequireWildcard(_runtime);\n\nfunction _interopRequireWildcard(obj) {\n  if (obj && obj.__esModule) {\n    return obj;\n  } else {\n    var newObj = {};if (obj != null) {\n      for (var key in obj) {\n        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];\n      }\n    }newObj.default = obj;return newObj;\n  }\n}\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\nvar client = function client() {\n  var routes = [];\n\n  var setupClientRoutes = function setupClientRoutes(appRoutes) {\n    routes = appRoutes;\n  };\n\n  if (false) {}\n\n  var data = window.SIMORGH_DATA || {};\n  var root = document.getElementById(\"root\");\n\n  (0, _reactDom.hydrate)(_react2.default.createElement(_reactUniversalApp.ClientApp, { data: data, routes: routes }), root);\n\n  if (true) {\n    module.hot.accept();\n  }\n}; /* eslint-disable react/jsx-filename-extension  */\nexports.default = client;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvY2xpZW50LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4uL3NpbW9yZ2gtcmVuZGVyZXIvc3JjL2NsaWVudC5qcz8wNjAxIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxucmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG52YXIgX3JlYWN0RG9tID0gcmVxdWlyZShcInJlYWN0LWRvbVwiKTtcblxudmFyIF9yZWFjdFVuaXZlcnNhbEFwcCA9IHJlcXVpcmUoXCJyZWFjdC11bml2ZXJzYWwtYXBwXCIpO1xuXG52YXIgX3J1bnRpbWUgPSByZXF1aXJlKFwib2ZmbGluZS1wbHVnaW4vcnVudGltZVwiKTtcblxudmFyIE9mZmxpbmVQbHVnaW5SdW50aW1lID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3J1bnRpbWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHtcbiAgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkge1xuICAgIHJldHVybiBvYmo7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG5ld09iaiA9IHt9O2lmIChvYmogIT0gbnVsbCkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9bmV3T2JqLmRlZmF1bHQgPSBvYmo7cmV0dXJuIG5ld09iajtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTtcbn1cblxudmFyIGNsaWVudCA9IGZ1bmN0aW9uIGNsaWVudCgpIHtcbiAgdmFyIHJvdXRlcyA9IFtdO1xuXG4gIHZhciBzZXR1cENsaWVudFJvdXRlcyA9IGZ1bmN0aW9uIHNldHVwQ2xpZW50Um91dGVzKGFwcFJvdXRlcykge1xuICAgIHJvdXRlcyA9IGFwcFJvdXRlcztcbiAgfTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgT2ZmbGluZVBsdWdpblJ1bnRpbWUuaW5zdGFsbCh7XG4gICAgICAvLyBTb3VyY2U6IGh0dHBzOi8vemFjaC5jb2Rlcy9oYW5kbGluZy1jbGllbnQtc2lkZS1hcHAtdXBkYXRlcy13aXRoLXNlcnZpY2Utd29ya2Vycy9cbiAgICAgIC8vIE5CIHRoaXMgbWVhbnMgbGlua3MgbXVzdCBoYXZlIHNwZWNpYWwgbG9naWMuIEkgaGF2ZSBubyBsaW5rcyB0byBhZGQgdGhpcyBvbiB5ZXQsIHNlZSB0aGUgbGluayBhYm92ZS5cbiAgICAgIG9uVXBkYXRlUmVhZHk6IGZ1bmN0aW9uIG9uVXBkYXRlUmVhZHkoKSB7XG4gICAgICAgIHJldHVybiBPZmZsaW5lUGx1Z2luUnVudGltZS5hcHBseVVwZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlZDogZnVuY3Rpb24gb25VcGRhdGVkKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnN3VXBkYXRlID0gdHJ1ZTtcbiAgICAgIH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXR1cm4tYXNzaWduXG4gICAgfSk7XG4gIH1cblxuICB2YXIgZGF0YSA9IHdpbmRvdy5TSU1PUkdIX0RBVEEgfHwge307XG4gIHZhciByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuXG4gICgwLCBfcmVhY3REb20uaHlkcmF0ZSkoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0VW5pdmVyc2FsQXBwLkNsaWVudEFwcCwgeyBkYXRhOiBkYXRhLCByb3V0ZXM6IHJvdXRlcyB9KSwgcm9vdCk7XG5cbiAgaWYgKG1vZHVsZS5ob3QpIHtcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICB9XG59OyAvKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9qc3gtZmlsZW5hbWUtZXh0ZW5zaW9uICAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gY2xpZW50OyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///../simorgh-renderer/src/client.js\n");

/***/ }),

/***/ "../simorgh-renderer/src/index.js":
/*!****************************************!*\
  !*** ../simorgh-renderer/src/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.getSimorghServer = exports.getSimorghClient = exports.getLocalServer = undefined;\n\nvar _http = __webpack_require__(/*! http */ \"http\");\n\nvar _http2 = _interopRequireDefault(_http);\n\nvar _server = __webpack_require__(/*! ./server */ \"../simorgh-renderer/src/server/index.jsx\");\n\nvar _server2 = _interopRequireDefault(_server);\n\nvar _client = __webpack_require__(/*! ./client */ \"../simorgh-renderer/src/client.js\");\n\nvar _client2 = _interopRequireDefault(_client);\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\nvar getLocalServer = exports.getLocalServer = function getLocalServer() {\n  var server = _http2.default.createServer(_server2.default);\n  var port = process.env.PORT || 7080;\n  var currentApp = _server2.default;\n\n  /* eslint-disable no-console */\n\n  server.listen(port, function (error) {\n    if (error) {\n      console.log(error);\n    }\n\n    console.log(\"Started and listening on http://localhost:\" + port);\n  });\n\n  if (true) {\n    console.log(\"✅  Server-side Hot Module Replacement enabled\");\n\n    module.hot.accept(/*! ./server */ \"../simorgh-renderer/src/server/index.jsx\", function () {\n      console.log(\"🔁  Hot Module Replacement reloading `./server`...\");\n      server.removeListener(\"request\", currentApp);\n      var newApp = __webpack_require__(/*! ./server */ \"../simorgh-renderer/src/server/index.jsx\").default; // eslint-disable-line global-require\n      server.on(\"request\", newApp);\n      currentApp = newApp;\n    });\n  }\n  return server;\n};\n\nvar getSimorghClient = exports.getSimorghClient = function getSimorghClient() {\n  return _client2.default;\n};\n\nvar getSimorghServer = exports.getSimorghServer = function getSimorghServer() {\n  return _server2.default;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvaW5kZXguanM/MWQwNCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0U2ltb3JnaFNlcnZlciA9IGV4cG9ydHMuZ2V0U2ltb3JnaENsaWVudCA9IGV4cG9ydHMuZ2V0TG9jYWxTZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbnZhciBfaHR0cCA9IHJlcXVpcmUoXCJodHRwXCIpO1xuXG52YXIgX2h0dHAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaHR0cCk7XG5cbnZhciBfc2VydmVyID0gcmVxdWlyZShcIi4vc2VydmVyXCIpO1xuXG52YXIgX3NlcnZlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXJ2ZXIpO1xuXG52YXIgX2NsaWVudCA9IHJlcXVpcmUoXCIuL2NsaWVudFwiKTtcblxudmFyIF9jbGllbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xpZW50KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07XG59XG5cbnZhciBnZXRMb2NhbFNlcnZlciA9IGV4cG9ydHMuZ2V0TG9jYWxTZXJ2ZXIgPSBmdW5jdGlvbiBnZXRMb2NhbFNlcnZlcigpIHtcbiAgdmFyIHNlcnZlciA9IF9odHRwMi5kZWZhdWx0LmNyZWF0ZVNlcnZlcihfc2VydmVyMi5kZWZhdWx0KTtcbiAgdmFyIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDcwODA7XG4gIHZhciBjdXJyZW50QXBwID0gX3NlcnZlcjIuZGVmYXVsdDtcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbiAgc2VydmVyLmxpc3Rlbihwb3J0LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0ZWQgYW5kIGxpc3RlbmluZyBvbiBodHRwOi8vbG9jYWxob3N0OlwiICsgcG9ydCk7XG4gIH0pO1xuXG4gIGlmIChtb2R1bGUuaG90KSB7XG4gICAgY29uc29sZS5sb2coXCLinIUgIFNlcnZlci1zaWRlIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgZW5hYmxlZFwiKTtcblxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiLi9zZXJ2ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCLwn5SBICBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IHJlbG9hZGluZyBgLi9zZXJ2ZXJgLi4uXCIpO1xuICAgICAgc2VydmVyLnJlbW92ZUxpc3RlbmVyKFwicmVxdWVzdFwiLCBjdXJyZW50QXBwKTtcbiAgICAgIHZhciBuZXdBcHAgPSByZXF1aXJlKFwiLi9zZXJ2ZXJcIikuZGVmYXVsdDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBnbG9iYWwtcmVxdWlyZVxuICAgICAgc2VydmVyLm9uKFwicmVxdWVzdFwiLCBuZXdBcHApO1xuICAgICAgY3VycmVudEFwcCA9IG5ld0FwcDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc2VydmVyO1xufTtcblxudmFyIGdldFNpbW9yZ2hDbGllbnQgPSBleHBvcnRzLmdldFNpbW9yZ2hDbGllbnQgPSBmdW5jdGlvbiBnZXRTaW1vcmdoQ2xpZW50KCkge1xuICByZXR1cm4gX2NsaWVudDIuZGVmYXVsdDtcbn07XG5cbnZhciBnZXRTaW1vcmdoU2VydmVyID0gZXhwb3J0cy5nZXRTaW1vcmdoU2VydmVyID0gZnVuY3Rpb24gZ2V0U2ltb3JnaFNlcnZlcigpIHtcbiAgcmV0dXJuIF9zZXJ2ZXIyLmRlZmF1bHQ7XG59OyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///../simorgh-renderer/src/index.js\n");

/***/ }),

/***/ "../simorgh-renderer/src/server/assets/index.js":
/*!******************************************************!*\
  !*** ../simorgh-renderer/src/server/assets/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _fs2 = _interopRequireDefault(_fs);\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\nvar getAssetsArray = function getAssetsArray() {\n  var assets = [];\n  var assetsManifestEnv = 'SIMORGH_ASSETS_MANIFEST_PATH';\n  try {\n    var assetManifest = JSON.parse(_fs2.default.readFileSync(process.env[assetsManifestEnv]));\n    var assetsManifestKeys = Object.keys(assetManifest);\n\n    /**\n     * Loops through the asset manifest, extracts the JS URL out of each entry and\n     * injects them into the assets array, which is passed to render.\n     * Loops backwards as the client bundle is output first, but needs to be last.\n     */\n    for (var i = assetsManifestKeys.length - 1; i >= 0; i -= 1) {\n      var key = assetsManifestKeys[i];\n      if (key.length > 0) {\n        assets.push(assetManifest[key].js);\n      }\n    }\n  } catch (error) {\n    /* eslint-disable no-console */\n    console.log('Error parsing assets manifest. ' + assetsManifestEnv + ' = ' + process.env[assetsManifestEnv]);\n    /* eslint-enable no-console */\n  }\n  return assets;\n};\n\nexports.default = getAssetsArray;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvc2VydmVyL2Fzc2V0cy9pbmRleC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9zaW1vcmdoLXJlbmRlcmVyL3NyYy9zZXJ2ZXIvYXNzZXRzL2luZGV4LmpzPzQ4NGEiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2ZzID0gcmVxdWlyZSgnZnMnKTtcblxudmFyIF9mczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mcyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9O1xufVxuXG52YXIgZ2V0QXNzZXRzQXJyYXkgPSBmdW5jdGlvbiBnZXRBc3NldHNBcnJheSgpIHtcbiAgdmFyIGFzc2V0cyA9IFtdO1xuICB2YXIgYXNzZXRzTWFuaWZlc3RFbnYgPSAnU0lNT1JHSF9BU1NFVFNfTUFOSUZFU1RfUEFUSCc7XG4gIHRyeSB7XG4gICAgdmFyIGFzc2V0TWFuaWZlc3QgPSBKU09OLnBhcnNlKF9mczIuZGVmYXVsdC5yZWFkRmlsZVN5bmMocHJvY2Vzcy5lbnZbYXNzZXRzTWFuaWZlc3RFbnZdKSk7XG4gICAgdmFyIGFzc2V0c01hbmlmZXN0S2V5cyA9IE9iamVjdC5rZXlzKGFzc2V0TWFuaWZlc3QpO1xuXG4gICAgLyoqXG4gICAgICogTG9vcHMgdGhyb3VnaCB0aGUgYXNzZXQgbWFuaWZlc3QsIGV4dHJhY3RzIHRoZSBKUyBVUkwgb3V0IG9mIGVhY2ggZW50cnkgYW5kXG4gICAgICogaW5qZWN0cyB0aGVtIGludG8gdGhlIGFzc2V0cyBhcnJheSwgd2hpY2ggaXMgcGFzc2VkIHRvIHJlbmRlci5cbiAgICAgKiBMb29wcyBiYWNrd2FyZHMgYXMgdGhlIGNsaWVudCBidW5kbGUgaXMgb3V0cHV0IGZpcnN0LCBidXQgbmVlZHMgdG8gYmUgbGFzdC5cbiAgICAgKi9cbiAgICBmb3IgKHZhciBpID0gYXNzZXRzTWFuaWZlc3RLZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICB2YXIga2V5ID0gYXNzZXRzTWFuaWZlc3RLZXlzW2ldO1xuICAgICAgaWYgKGtleS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzc2V0cy5wdXNoKGFzc2V0TWFuaWZlc3Rba2V5XS5qcyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICBjb25zb2xlLmxvZygnRXJyb3IgcGFyc2luZyBhc3NldHMgbWFuaWZlc3QuICcgKyBhc3NldHNNYW5pZmVzdEVudiArICcgPSAnICsgcHJvY2Vzcy5lbnZbYXNzZXRzTWFuaWZlc3RFbnZdKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgfVxuICByZXR1cm4gYXNzZXRzO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0QXNzZXRzQXJyYXk7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../simorgh-renderer/src/server/assets/index.js\n");

/***/ }),

/***/ "../simorgh-renderer/src/server/index.jsx":
/*!************************************************!*\
  !*** ../simorgh-renderer/src/server/index.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _react = __webpack_require__(/*! react */ \"react\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _express = __webpack_require__(/*! express */ \"express\");\n\nvar _express2 = _interopRequireDefault(_express);\n\nvar _reactUniversalApp = __webpack_require__(/*! react-universal-app */ \"react-universal-app\");\n\nvar _server = __webpack_require__(/*! react-dom/server */ \"react-dom/server\");\n\nvar _styledComponents = __webpack_require__(/*! styled-components */ \"styled-components\");\n\nvar _reactHelmet = __webpack_require__(/*! react-helmet */ \"react-helmet\");\n\nvar _compression = __webpack_require__(/*! compression */ \"compression\");\n\nvar _compression2 = _interopRequireDefault(_compression);\n\nvar _expressStaticGzip = __webpack_require__(/*! express-static-gzip */ \"express-static-gzip\");\n\nvar _expressStaticGzip2 = _interopRequireDefault(_expressStaticGzip);\n\nvar _fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _fs2 = _interopRequireDefault(_fs);\n\nvar _path = __webpack_require__(/*! path */ \"path\");\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _helmet = __webpack_require__(/*! helmet */ \"helmet\");\n\nvar _helmet2 = _interopRequireDefault(_helmet);\n\nvar _gnuTerryPratchett = __webpack_require__(/*! gnu-terry-pratchett */ \"gnu-terry-pratchett\");\n\nvar _gnuTerryPratchett2 = _interopRequireDefault(_gnuTerryPratchett);\n\nvar _dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\n\nvar _dotenv2 = _interopRequireDefault(_dotenv);\n\nvar _styles = __webpack_require__(/*! ./styles */ \"../simorgh-renderer/src/server/styles.jsx\");\n\nvar _assets = __webpack_require__(/*! ./assets */ \"../simorgh-renderer/src/server/assets/index.js\");\n\nvar _assets2 = _interopRequireDefault(_assets);\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\nfunction _asyncToGenerator(fn) {\n  return function () {\n    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {\n      function step(key, arg) {\n        try {\n          var info = gen[key](arg);var value = info.value;\n        } catch (error) {\n          reject(error);return;\n        }if (info.done) {\n          resolve(value);\n        } else {\n          return Promise.resolve(value).then(function (value) {\n            step(\"next\", value);\n          }, function (err) {\n            step(\"throw\", err);\n          });\n        }\n      }return step(\"next\");\n    });\n  };\n}\n// not part of react-helmet\n\n\nvar applicationServer = function applicationServer() {\n  var dataRegexPath = \"\";\n  var routes = [];\n  var Document = _react2.default.createElement(\"html\", null);\n\n  var result = _dotenv2.default.config();\n\n  if (result.error) {\n    throw result.error;\n  }\n\n  var assets = (0, _assets2.default)();\n\n  var publicDirectory = process.env.SIMORGH_PUBLIC_DIR;\n  var dataFolderToRender =  false ? undefined : \"data/test\";\n\n  var server = function server(appRoutes, mockDataPath, documentComponent) {\n    routes = appRoutes;\n    dataRegexPath = mockDataPath;\n    Document = documentComponent;\n    return (0, _express2.default)();\n  };\n  server.disable(\"x-powered-by\").use((0, _compression2.default)()).use((0, _helmet2.default)({ frameguard: { action: \"deny\" } })).use((0, _expressStaticGzip2.default)(publicDirectory, {\n    enableBrotli: true,\n    orderPreference: [\"br\"]\n  })).use((0, _gnuTerryPratchett2.default)()).get(dataRegexPath, function () {\n    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, res) {\n      var params = _ref.params;\n      var service, id, dataFilePath;\n      return regeneratorRuntime.wrap(function _callee$(_context) {\n        while (1) {\n          switch (_context.prev = _context.next) {\n            case 0:\n              service = params.service, id = params.id;\n              dataFilePath = _path2.default.join(dataFolderToRender, service, id + \".json\");\n\n              _fs2.default.readFile(dataFilePath, function (error, data) {\n                if (error) {\n                  res.sendStatus(404);\n                  console.log(error); // eslint-disable-line no-console\n                  return null;\n                }\n\n                var articleJSON = JSON.parse(data);\n\n                res.setHeader(\"Content-Type\", \"application/json\");\n                res.json(articleJSON);\n                return null;\n              });\n\n            case 3:\n            case \"end\":\n              return _context.stop();\n          }\n        }\n      }, _callee, undefined);\n    }));\n\n    return function (_x, _x2) {\n      return _ref2.apply(this, arguments);\n    };\n  }()).get(\"/status\", function (req, res) {\n    res.sendStatus(200);\n  }).get(\"/*\", function () {\n    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3, res) {\n      var url = _ref3.url;\n      var sheet, data, app, headHelmet, doc, message;\n      return regeneratorRuntime.wrap(function _callee2$(_context2) {\n        while (1) {\n          switch (_context2.prev = _context2.next) {\n            case 0:\n              _context2.prev = 0;\n              sheet = new _styledComponents.ServerStyleSheet();\n              _context2.next = 4;\n              return (0, _reactUniversalApp.loadInitialData)(url, routes);\n\n            case 4:\n              data = _context2.sent;\n              app = (0, _server.renderToString)(sheet.collectStyles(_react2.default.createElement(_reactUniversalApp.ServerApp, {\n                location: url,\n                routes: routes,\n                data: data,\n                context: {}\n              })));\n              headHelmet = _reactHelmet.Helmet.renderStatic();\n              doc = (0, _server.renderToStaticMarkup)(_react2.default.createElement(Document, {\n                assets: assets,\n                app: app,\n                data: data,\n                styleTags: (0, _styles.getStyleTag)(sheet, data.isAmp),\n                helmet: headHelmet\n              }));\n\n              res.send(\"<!doctype html>\" + doc);\n              _context2.next = 15;\n              break;\n\n            case 11:\n              _context2.prev = 11;\n              _context2.t0 = _context2[\"catch\"](0);\n              message = _context2.t0.message;\n\n              res.status(404).send(message);\n\n            case 15:\n            case \"end\":\n              return _context2.stop();\n          }\n        }\n      }, _callee2, undefined, [[0, 11]]);\n    }));\n\n    return function (_x3, _x4) {\n      return _ref4.apply(this, arguments);\n    };\n  }());\n};\n\nexports.default = applicationServer;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvc2VydmVyL2luZGV4LmpzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9zaW1vcmdoLXJlbmRlcmVyL3NyYy9zZXJ2ZXIvaW5kZXguanN4PzQyMTkiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2V4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxudmFyIF9leHByZXNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4cHJlc3MpO1xuXG52YXIgX3JlYWN0VW5pdmVyc2FsQXBwID0gcmVxdWlyZShcInJlYWN0LXVuaXZlcnNhbC1hcHBcIik7XG5cbnZhciBfc2VydmVyID0gcmVxdWlyZShcInJlYWN0LWRvbS9zZXJ2ZXJcIik7XG5cbnZhciBfc3R5bGVkQ29tcG9uZW50cyA9IHJlcXVpcmUoXCJzdHlsZWQtY29tcG9uZW50c1wiKTtcblxudmFyIF9yZWFjdEhlbG1ldCA9IHJlcXVpcmUoXCJyZWFjdC1oZWxtZXRcIik7XG5cbnZhciBfY29tcHJlc3Npb24gPSByZXF1aXJlKFwiY29tcHJlc3Npb25cIik7XG5cbnZhciBfY29tcHJlc3Npb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29tcHJlc3Npb24pO1xuXG52YXIgX2V4cHJlc3NTdGF0aWNHemlwID0gcmVxdWlyZShcImV4cHJlc3Mtc3RhdGljLWd6aXBcIik7XG5cbnZhciBfZXhwcmVzc1N0YXRpY0d6aXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXhwcmVzc1N0YXRpY0d6aXApO1xuXG52YXIgX2ZzID0gcmVxdWlyZShcImZzXCIpO1xuXG52YXIgX2ZzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZzKTtcblxudmFyIF9wYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbnZhciBfcGF0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYXRoKTtcblxudmFyIF9oZWxtZXQgPSByZXF1aXJlKFwiaGVsbWV0XCIpO1xuXG52YXIgX2hlbG1ldDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxtZXQpO1xuXG52YXIgX2dudVRlcnJ5UHJhdGNoZXR0ID0gcmVxdWlyZShcImdudS10ZXJyeS1wcmF0Y2hldHRcIik7XG5cbnZhciBfZ251VGVycnlQcmF0Y2hldHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ251VGVycnlQcmF0Y2hldHQpO1xuXG52YXIgX2RvdGVudiA9IHJlcXVpcmUoXCJkb3RlbnZcIik7XG5cbnZhciBfZG90ZW52MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvdGVudik7XG5cbnZhciBfc3R5bGVzID0gcmVxdWlyZShcIi4vc3R5bGVzXCIpO1xuXG52YXIgX2Fzc2V0cyA9IHJlcXVpcmUoXCIuL2Fzc2V0c1wiKTtcblxudmFyIF9hc3NldHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzZXRzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdlbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGZ1bmN0aW9uIHN0ZXAoa2V5LCBhcmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7dmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO3JldHVybjtcbiAgICAgICAgfWlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgc3RlcChcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHN0ZXAoXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9cmV0dXJuIHN0ZXAoXCJuZXh0XCIpO1xuICAgIH0pO1xuICB9O1xufVxuLy8gbm90IHBhcnQgb2YgcmVhY3QtaGVsbWV0XG5cblxudmFyIGFwcGxpY2F0aW9uU2VydmVyID0gZnVuY3Rpb24gYXBwbGljYXRpb25TZXJ2ZXIoKSB7XG4gIHZhciBkYXRhUmVnZXhQYXRoID0gXCJcIjtcbiAgdmFyIHJvdXRlcyA9IFtdO1xuICB2YXIgRG9jdW1lbnQgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImh0bWxcIiwgbnVsbCk7XG5cbiAgdmFyIHJlc3VsdCA9IF9kb3RlbnYyLmRlZmF1bHQuY29uZmlnKCk7XG5cbiAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgfVxuXG4gIHZhciBhc3NldHMgPSAoMCwgX2Fzc2V0czIuZGVmYXVsdCkoKTtcblxuICB2YXIgcHVibGljRGlyZWN0b3J5ID0gcHJvY2Vzcy5lbnYuU0lNT1JHSF9QVUJMSUNfRElSO1xuICB2YXIgZGF0YUZvbGRlclRvUmVuZGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gXCJkYXRhL3Byb2RcIiA6IFwiZGF0YS90ZXN0XCI7XG5cbiAgdmFyIHNlcnZlciA9IGZ1bmN0aW9uIHNlcnZlcihhcHBSb3V0ZXMsIG1vY2tEYXRhUGF0aCwgZG9jdW1lbnRDb21wb25lbnQpIHtcbiAgICByb3V0ZXMgPSBhcHBSb3V0ZXM7XG4gICAgZGF0YVJlZ2V4UGF0aCA9IG1vY2tEYXRhUGF0aDtcbiAgICBEb2N1bWVudCA9IGRvY3VtZW50Q29tcG9uZW50O1xuICAgIHJldHVybiAoMCwgX2V4cHJlc3MyLmRlZmF1bHQpKCk7XG4gIH07XG4gIHNlcnZlci5kaXNhYmxlKFwieC1wb3dlcmVkLWJ5XCIpLnVzZSgoMCwgX2NvbXByZXNzaW9uMi5kZWZhdWx0KSgpKS51c2UoKDAsIF9oZWxtZXQyLmRlZmF1bHQpKHsgZnJhbWVndWFyZDogeyBhY3Rpb246IFwiZGVueVwiIH0gfSkpLnVzZSgoMCwgX2V4cHJlc3NTdGF0aWNHemlwMi5kZWZhdWx0KShwdWJsaWNEaXJlY3RvcnksIHtcbiAgICBlbmFibGVCcm90bGk6IHRydWUsXG4gICAgb3JkZXJQcmVmZXJlbmNlOiBbXCJiclwiXVxuICB9KSkudXNlKCgwLCBfZ251VGVycnlQcmF0Y2hldHQyLmRlZmF1bHQpKCkpLmdldChkYXRhUmVnZXhQYXRoLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9yZWYyID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9yZWdlbmVyYXRvclJ1bnRpbWUubWFyayhmdW5jdGlvbiBfY2FsbGVlKF9yZWYsIHJlcykge1xuICAgICAgdmFyIHBhcmFtcyA9IF9yZWYucGFyYW1zO1xuICAgICAgdmFyIHNlcnZpY2UsIGlkLCBkYXRhRmlsZVBhdGg7XG4gICAgICByZXR1cm4gcmVnZW5lcmF0b3JSdW50aW1lLndyYXAoZnVuY3Rpb24gX2NhbGxlZSQoX2NvbnRleHQpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIHNlcnZpY2UgPSBwYXJhbXMuc2VydmljZSwgaWQgPSBwYXJhbXMuaWQ7XG4gICAgICAgICAgICAgIGRhdGFGaWxlUGF0aCA9IF9wYXRoMi5kZWZhdWx0LmpvaW4oZGF0YUZvbGRlclRvUmVuZGVyLCBzZXJ2aWNlLCBpZCArIFwiLmpzb25cIik7XG5cbiAgICAgICAgICAgICAgX2ZzMi5kZWZhdWx0LnJlYWRGaWxlKGRhdGFGaWxlUGF0aCwgZnVuY3Rpb24gKGVycm9yLCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICByZXMuc2VuZFN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBhcnRpY2xlSlNPTiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgICByZXMuanNvbihhcnRpY2xlSlNPTik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBfY2FsbGVlLCB1bmRlZmluZWQpO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoX3gsIF94Mikge1xuICAgICAgcmV0dXJuIF9yZWYyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSgpKS5nZXQoXCIvc3RhdHVzXCIsIGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgIHJlcy5zZW5kU3RhdHVzKDIwMCk7XG4gIH0pLmdldChcIi8qXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3JlZjQgPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL3JlZ2VuZXJhdG9yUnVudGltZS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUyKF9yZWYzLCByZXMpIHtcbiAgICAgIHZhciB1cmwgPSBfcmVmMy51cmw7XG4gICAgICB2YXIgc2hlZXQsIGRhdGEsIGFwcCwgaGVhZEhlbG1ldCwgZG9jLCBtZXNzYWdlO1xuICAgICAgcmV0dXJuIHJlZ2VuZXJhdG9yUnVudGltZS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUyJChfY29udGV4dDIpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0Mi5wcmV2ID0gX2NvbnRleHQyLm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgX2NvbnRleHQyLnByZXYgPSAwO1xuICAgICAgICAgICAgICBzaGVldCA9IG5ldyBfc3R5bGVkQ29tcG9uZW50cy5TZXJ2ZXJTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gNDtcbiAgICAgICAgICAgICAgcmV0dXJuICgwLCBfcmVhY3RVbml2ZXJzYWxBcHAubG9hZEluaXRpYWxEYXRhKSh1cmwsIHJvdXRlcyk7XG5cbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgZGF0YSA9IF9jb250ZXh0Mi5zZW50O1xuICAgICAgICAgICAgICBhcHAgPSAoMCwgX3NlcnZlci5yZW5kZXJUb1N0cmluZykoc2hlZXQuY29sbGVjdFN0eWxlcyhfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RVbml2ZXJzYWxBcHAuU2VydmVyQXBwLCB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb246IHVybCxcbiAgICAgICAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHt9XG4gICAgICAgICAgICAgIH0pKSk7XG4gICAgICAgICAgICAgIGhlYWRIZWxtZXQgPSBfcmVhY3RIZWxtZXQuSGVsbWV0LnJlbmRlclN0YXRpYygpO1xuICAgICAgICAgICAgICBkb2MgPSAoMCwgX3NlcnZlci5yZW5kZXJUb1N0YXRpY01hcmt1cCkoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoRG9jdW1lbnQsIHtcbiAgICAgICAgICAgICAgICBhc3NldHM6IGFzc2V0cyxcbiAgICAgICAgICAgICAgICBhcHA6IGFwcCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHN0eWxlVGFnczogKDAsIF9zdHlsZXMuZ2V0U3R5bGVUYWcpKHNoZWV0LCBkYXRhLmlzQW1wKSxcbiAgICAgICAgICAgICAgICBoZWxtZXQ6IGhlYWRIZWxtZXRcbiAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgIHJlcy5zZW5kKFwiPCFkb2N0eXBlIGh0bWw+XCIgKyBkb2MpO1xuICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDE1O1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgICAgX2NvbnRleHQyLnByZXYgPSAxMTtcbiAgICAgICAgICAgICAgX2NvbnRleHQyLnQwID0gX2NvbnRleHQyW1wiY2F0Y2hcIl0oMCk7XG4gICAgICAgICAgICAgIG1lc3NhZ2UgPSBfY29udGV4dDIudDAubWVzc2FnZTtcblxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZChtZXNzYWdlKTtcblxuICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBfY2FsbGVlMiwgdW5kZWZpbmVkLCBbWzAsIDExXV0pO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoX3gzLCBfeDQpIHtcbiAgICAgIHJldHVybiBfcmVmNC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0oKSk7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBhcHBsaWNhdGlvblNlcnZlcjsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../simorgh-renderer/src/server/index.jsx\n");

/***/ }),

/***/ "../simorgh-renderer/src/server/styles.jsx":
/*!*************************************************!*\
  !*** ../simorgh-renderer/src/server/styles.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.getStyleTag = undefined;\n\nvar _react = __webpack_require__(/*! react */ \"react\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\nvar getStyleTag = exports.getStyleTag = function getStyleTag(sheet) {\n  var isAmp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n  var styleTags = sheet.getStyleElement();\n  if (!isAmp) return styleTags;\n\n  var inlineCss = styleTags.reduce(function (inlineStyles, currentStylesheet) {\n    if (currentStylesheet && currentStylesheet.props) {\n      return '' + inlineStyles +\n      // eslint-disable-next-line no-underscore-dangle\n      currentStylesheet.props.dangerouslySetInnerHTML.__html;\n    }\n    return inlineStyles;\n  }, '');\n\n  return (\n    // eslint-disable-next-line react/no-danger\n    _react2.default.createElement('style', { 'amp-custom': '', dangerouslySetInnerHTML: { __html: inlineCss } })\n  );\n};\n\nexports.default = getStyleTag;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvc2VydmVyL3N0eWxlcy5qc3guanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vc2ltb3JnaC1yZW5kZXJlci9zcmMvc2VydmVyL3N0eWxlcy5qc3g/OGVlMSJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdldFN0eWxlVGFnID0gdW5kZWZpbmVkO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9O1xufVxuXG52YXIgZ2V0U3R5bGVUYWcgPSBleHBvcnRzLmdldFN0eWxlVGFnID0gZnVuY3Rpb24gZ2V0U3R5bGVUYWcoc2hlZXQpIHtcbiAgdmFyIGlzQW1wID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICB2YXIgc3R5bGVUYWdzID0gc2hlZXQuZ2V0U3R5bGVFbGVtZW50KCk7XG4gIGlmICghaXNBbXApIHJldHVybiBzdHlsZVRhZ3M7XG5cbiAgdmFyIGlubGluZUNzcyA9IHN0eWxlVGFncy5yZWR1Y2UoZnVuY3Rpb24gKGlubGluZVN0eWxlcywgY3VycmVudFN0eWxlc2hlZXQpIHtcbiAgICBpZiAoY3VycmVudFN0eWxlc2hlZXQgJiYgY3VycmVudFN0eWxlc2hlZXQucHJvcHMpIHtcbiAgICAgIHJldHVybiAnJyArIGlubGluZVN0eWxlcyArXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGVcbiAgICAgIGN1cnJlbnRTdHlsZXNoZWV0LnByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLl9faHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIGlubGluZVN0eWxlcztcbiAgfSwgJycpO1xuXG4gIHJldHVybiAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRhbmdlclxuICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdzdHlsZScsIHsgJ2FtcC1jdXN0b20nOiAnJywgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBpbmxpbmVDc3MgfSB9KVxuICApO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0U3R5bGVUYWc7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///../simorgh-renderer/src/server/styles.jsx\n");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function (updatedModules, renewedModules) {\n\tvar unacceptedModules = updatedModules.filter(function (moduleId) {\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\n\t});\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tif (unacceptedModules.length > 0) {\n\t\tlog(\"warning\", \"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\");\n\t\tunacceptedModules.forEach(function (moduleId) {\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\n\t\t});\n\t}\n\n\tif (!renewedModules || renewedModules.length === 0) {\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\n\t} else {\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\n\t\trenewedModules.forEach(function (moduleId) {\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n\t\t\t\tvar parts = moduleId.split(\"!\");\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t\tlog.groupEnd(\"info\");\n\t\t\t} else {\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\n\t\t\t}\n\t\t});\n\t\tvar numberIds = renewedModules.every(function (moduleId) {\n\t\t\treturn typeof moduleId === \"number\";\n\t\t});\n\t\tif (numberIds) log(\"info\", \"[HMR] Consider using the NamedModulesPlugin for module names.\");\n\t}\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8od2VicGFjaykvaG90L2xvZy1hcHBseS1yZXN1bHQuanM/OWE3YiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiKTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiKTtcblx0fVxufTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/log-apply-result.js\n");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n\tvar shouldLog = logLevel === \"info\" && level === \"info\" || [\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\" || [\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\";\n\treturn shouldLog;\n}\n\nfunction logGroup(logFn) {\n\treturn function (level, msg) {\n\t\tif (shouldLog(level)) {\n\t\t\tlogFn(msg);\n\t\t}\n\t};\n}\n\nmodule.exports = function (level, msg) {\n\tif (shouldLog(level)) {\n\t\tif (level === \"info\") {\n\t\t\tconsole.log(msg);\n\t\t} else if (level === \"warning\") {\n\t\t\tconsole.warn(msg);\n\t\t} else if (level === \"error\") {\n\t\t\tconsole.error(msg);\n\t\t}\n\t}\n};\n\n/* eslint-disable node/no-unsupported-features/node-builtins */\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\n\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\n\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function (level) {\n\tlogLevel = level;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLmpzPzgzMjciXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID0gbG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIiB8fCBbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIiB8fCBbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIjtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChsZXZlbCwgbXNnKSB7XG5cdFx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRcdGxvZ0ZuKG1zZyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59OyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/log.js\n");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/*!*********************************!*\
  !*** (webpack)/hot/poll.js?100 ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {\n\n/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n/*globals __resourceQuery */\nif (true) {\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\n\t\tif (module.hot.status() === \"idle\") {\n\t\t\tmodule.hot.check(true).then(function (updatedModules) {\n\t\t\t\tif (!updatedModules) {\n\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\t\t\t\tcheckForUpdate(true);\n\t\t\t}).catch(function (err) {\n\t\t\t\tvar status = module.hot.status();\n\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\n\t\t\t\t\tlog(\"warning\", \"[HMR] \" + (err.stack || err.message));\n\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\n\t\t\t\t} else {\n\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + (err.stack || err.message));\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n\tsetInterval(checkForUpdate, hotPollInterval);\n} else {}\n/* WEBPACK VAR INJECTION */}.call(this, \"?100\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcz8xMDAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9wb2xsLmpzPzQ5YjIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdC5jaGVjayh0cnVlKS50aGVuKGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIChlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpKTtcblx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIChlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/poll.js?100\n");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _simorghRenderer = __webpack_require__(/*! simorgh-renderer */ \"../simorgh-renderer/src/index.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/N2QwOSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9zaW1vcmdoUmVuZGVyZXIgPSByZXF1aXJlKFwic2ltb3JnaC1yZW5kZXJlclwiKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi webpack/hot/poll?100 ./src ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?100 */"./node_modules/webpack/hot/poll.js?100");
module.exports = __webpack_require__(/*! ./src */"./src/index.js");


/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-static-gzip":
/*!**************************************!*\
  !*** external "express-static-gzip" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-static-gzip");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "gnu-terry-pratchett":
/*!**************************************!*\
  !*** external "gnu-terry-pratchett" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("gnu-terry-pratchett");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "offline-plugin/runtime":
/*!*****************************************!*\
  !*** external "offline-plugin/runtime" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("offline-plugin/runtime");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-helmet":
/*!*******************************!*\
  !*** external "react-helmet" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-helmet");

/***/ }),

/***/ "react-universal-app":
/*!**************************************!*\
  !*** external "react-universal-app" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-universal-app");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("styled-components");

/***/ })

/******/ });