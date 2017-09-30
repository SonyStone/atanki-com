/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4b927eafedc1de83f72c"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
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
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
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
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
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
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
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
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
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
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
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
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
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
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
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
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
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
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
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
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
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
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(6)(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector2d = (function () {
    function Vector2d(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector2d.fromAngle = function (angle) {
        return new Vector2d(Math.cos(angle), Math.sin(angle));
    };
    Vector2d.angleTo = function (vec1, vec2) {
        return Math.atan2((vec1.y - vec2.y), (vec1.x - vec2.x));
    };
    Vector2d.clone = function (vec) {
        return new Vector2d(vec.x, vec.y);
    };
    Vector2d.magnitude = function (vector) {
        return (Math.sqrt((vector.getX() * vector.getX()) +
            (vector.getY() * vector.getY())));
    };
    Vector2d.magnitudeSquared = function (vector) {
        return ((vector.getX() * vector.getX()) +
            (vector.getY() * vector.getY()));
    };
    Vector2d.rotate = function (vector, angle) {
        return new Vector2d((vector.getX() * Math.cos(angle)) - (vector.getY() * Math.sin(angle)), (vector.getX() * Math.sin(angle)) + (vector.getY() * Math.cos(angle)));
    };
    Vector2d.rotateAbout = function (vectorA, angle, vectorB) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = vectorB.x + ((vectorA.x - vectorB.x) * cos - (vectorA.y - vectorB.y) * sin);
        var y = vectorB.y + ((vectorA.x - vectorB.x) * sin + (vectorA.y - vectorB.y) * cos);
        return new Vector2d(x, y);
    };
    Vector2d.isLessOrEqual = function (vectorA, vectorB) {
        return ((vectorA.getX() <= vectorB.getX()) &&
            (vectorA.getY() <= vectorB.getY()));
    };
    Vector2d.isGreaterOrEqual = function (vectorA, vectorB) {
        return ((vectorA.getX() >= vectorB.getX()) &&
            (vectorA.getY() >= vectorB.getY()));
    };
    Vector2d.isLess = function (vectorA, vectorB) {
        return ((vectorA.getX() < vectorB.getX()) &&
            (vectorA.getY() < vectorB.getY()));
    };
    Vector2d.isGreater = function (vectorA, vectorB) {
        return ((vectorA.getX() > vectorB.getX()) &&
            (vectorA.getY() > vectorB.getY()));
    };
    Vector2d.prototype.getX = function () {
        return this.x;
    };
    Vector2d.prototype.getY = function () {
        return this.y;
    };
    Vector2d.prototype.set = function (xOrVec, y) {
        if (typeof xOrVec === "object") {
            this.x = xOrVec.x;
            this.y = xOrVec.y;
        }
        else if (typeof xOrVec === "number" && typeof y === "number") {
            this.x = xOrVec;
            this.y = y;
        }
        return this;
    };
    Vector2d.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector2d.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector2d.prototype.setZero = function () {
        this.x = 0;
        this.y = 0;
        return this;
    };
    Vector2d.prototype.copy = function () {
        return new Vector2d(this.x, this.y);
    };
    Vector2d.prototype.mag = function () {
        return (Math.sqrt((this.x * this.x) +
            (this.y * this.y)));
    };
    Vector2d.prototype.magSq = function () {
        return ((this.x * this.x) + (this.y * this.y));
    };
    Vector2d.prototype.add = function (vec) {
        return new Vector2d((this.x + vec.x), (this.y + vec.y));
    };
    Vector2d.prototype.sub = function (vec) {
        return new Vector2d((this.x - vec.x), (this.y - vec.y));
    };
    Vector2d.prototype.mult = function (scalar) {
        return new Vector2d((this.x * scalar), (this.y * scalar));
    };
    Vector2d.prototype.div = function (scalar) {
        return new Vector2d((this.x / scalar), (this.y / scalar));
    };
    Vector2d.prototype.dist = function (vec) {
        return Math.sqrt(Math.pow(this.x - vec.x, 2) +
            Math.pow(this.y - vec.y, 2));
    };
    Vector2d.prototype.dot = function (vec) {
        return (this.x * vec.x) + (this.y * vec.y);
    };
    Vector2d.prototype.normalize = function () {
        return this.div(this.mag());
    };
    Vector2d.prototype.limit = function (scalar) {
        if (this.magSq() > scalar * scalar) {
            this.normalize().mult(scalar);
        }
        return this;
    };
    Vector2d.prototype.setMag = function (scalar) {
        return this.normalize().mult(scalar);
    };
    Vector2d.prototype.heading = function () {
        return Math.atan2(this.y, this.x);
    };
    Vector2d.prototype.rotate = function (angle) {
        return new Vector2d((this.x * Math.cos(angle)) - (this.y * Math.sin(angle)), (this.x * Math.sin(angle)) + (this.y * Math.cos(angle)));
    };
    Vector2d.prototype.lerp = function (vec, amount) {
        if (amount > 1) {
            amount = 1;
        }
        if (amount < 0) {
            amount = 0;
        }
        return this.mult(amount).add(vec.copy().mult(1 - amount));
    };
    Vector2d.prototype.invert = function () {
        var x = this.x * -1;
        var y = this.y * -1;
        return new Vector2d(x, y);
    };
    Vector2d.prototype.positioning = function (camera) {
        return this.invert().rotate(camera.rotation).mult(camera.zoom).add(camera.focus);
    };
    Vector2d.prototype.toArray = function () {
        return [this.x, this.y];
    };
    Vector2d.prototype.toString = function () {
        return "x:" +
            this.x.toFixed(2) +
            ", y:" +
            this.y.toFixed(2) +
            " ";
    };
    return Vector2d;
}());
exports.default = Vector2d;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.captureMouse = function (element) {
        var mouse = {
            x: 0,
            y: 0,
            LButton: { code: 0, pressed: false },
            RButton: { code: 2, pressed: false },
            MButton: { code: 1, pressed: false },
            WheelUp: {
                click: false,
                get pressed() {
                    if (this.click) {
                        this.click = false;
                        return true;
                    }
                    return false;
                }
            },
            WheelDown: {
                click: false,
                get pressed() {
                    if (this.click) {
                        this.click = false;
                        return true;
                    }
                    return false;
                },
            },
        };
        element.oncontextmenu = function (a) {
            a.preventDefault();
        };
        element.addEventListener('mousemove', function (event) {
            var x, y;
            var mouse_event = eventPositionCapture(x, y, event, element);
            mouse.x = mouse_event.x;
            mouse.y = mouse_event.y;
        }, false);
        element.addEventListener('mousedown', function (event) {
            var name;
            for (name in mouse) {
                if (mouse.hasOwnProperty(name)) {
                    if (mouse[name].code === event.button) {
                        mouse[name].pressed = true;
                    }
                }
            }
        }, false);
        element.addEventListener('mouseup', function (event) {
            var buttonName;
            for (var name_1 in mouse) {
                if (mouse.hasOwnProperty(name_1)) {
                    if (mouse[name_1].code === event.button) {
                        mouse[name_1].pressed = false;
                    }
                }
            }
        }, false);
        element.addEventListener('wheel', function (event) {
            if (event.deltaY < 0) {
                mouse["WheelUp"].click = true;
            }
            else {
                mouse["WheelDown"].click = true;
            }
        }, false);
        return mouse;
    };
    ;
    Utils.captureTouch = function (element) {
        var touch = { x: null, y: null, isPressed: false };
        element.addEventListener('touchstart', function (event) {
            touch.isPressed = true;
        }, false);
        element.addEventListener('touchend', function (event) {
            touch.isPressed = false;
            touch.x = null;
            touch.y = null;
        }, false);
        element.addEventListener('touchmove', function (event) {
            var x, y;
            var touch_event = eventPositionCapture(x, y, event.touches[0], element);
            touch.x = touch_event.x;
            touch.y = touch_event.y;
        }, false);
        return touch;
    };
    Utils.captureKeyboard = function (element) {
        var key = {
            left: { code: 37, pressed: false },
            right: { code: 39, pressed: false },
            up: { code: 38, pressed: false },
            down: { code: 40, pressed: false },
            w: { code: 87, pressed: false },
            a: { code: 65, pressed: false },
            s: { code: 83, pressed: false },
            d: { code: 68, pressed: false },
            e: { code: 69, pressed: false },
            q: { code: 81, pressed: false },
            x: { code: 88, pressed: false },
            z: { code: 90, pressed: false },
            NumpadAdd: { code: 107, pressed: false },
            NumpadSub: { code: 109, pressed: false }
        };
        element.addEventListener("keydown", function (event) {
            var name;
            for (name in key) {
                if (key.hasOwnProperty(name)) {
                    if (key[name].code === event.keyCode) {
                        key[name].pressed = true;
                    }
                }
            }
        }, false);
        element.addEventListener("keyup", function (event) {
            var name;
            for (name in key) {
                if (key.hasOwnProperty(name)) {
                    if (key[name].code === event.keyCode) {
                        key[name].pressed = false;
                    }
                }
            }
        }, false);
        return key;
    };
    Utils.colorToRGB = function (color, alpha) {
        if (typeof color === 'string' && color[0] === '#') {
            color = parseInt(color.slice(1), 16);
        }
        alpha = (alpha === undefined) ? 1 : alpha;
        var r = color >> 16 & 0xff;
        var g = color >> 8 & 0xff;
        var b = color & 0xff;
        var a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
        if (a === 1) {
            return "rgb(" + r + "," + g + "," + b + ")";
        }
        else {
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        }
    };
    Utils.HSBtoRGB = function (hue, saturation, brightness, radians) {
        if (hue === undefined) {
            hue = 0;
        }
        if (saturation === undefined) {
            saturation = 75;
        }
        if (brightness === undefined) {
            brightness = 75;
        }
        if (radians === undefined) {
            radians = false;
        }
        if (radians) {
            hue *= 180 / Math.PI;
        }
        var HSB = {
            h: hue % 360,
            s: saturation / 100,
            b: brightness / 100
        };
        var RGB = {
            r: null,
            g: null,
            b: null,
            color: function () {
                return "rgb(" + Math.round(this.r) +
                    "," + Math.round(this.g) +
                    "," + Math.round(this.b) + ")";
            }
        };
        var chroma;
        var hueI;
        var x;
        var m;
        if (HSB.h < 0) {
            HSB.h += 360;
        }
        if (HSB.s > 100) {
            HSB.s = 100;
        }
        else if (HSB.s < 0) {
            HSB.s = 0;
        }
        if (HSB.b > 100) {
            HSB.b = 100;
        }
        else if (HSB.b < 0) {
            HSB.b = 0;
        }
        chroma = HSB.s * HSB.b;
        hueI = HSB.h / 60;
        x = chroma * (1 - Math.abs(hueI % 2 - 1));
        switch (Math.floor(hueI)) {
            case 0:
                RGB.r = chroma;
                RGB.g = x;
                RGB.b = 0;
                break;
            case 1:
                RGB.r = x;
                RGB.g = chroma;
                RGB.b = 0;
                break;
            case 2:
                RGB.r = 0;
                RGB.g = chroma;
                RGB.b = x;
                break;
            case 3:
                RGB.r = 0;
                RGB.g = x;
                RGB.b = chroma;
                break;
            case 4:
                RGB.r = x;
                RGB.g = 0;
                RGB.b = chroma;
                break;
            case 5:
                RGB.r = chroma;
                RGB.g = 0;
                RGB.b = x;
                break;
        }
        m = HSB.b - chroma;
        RGB.r += m;
        RGB.g += m;
        RGB.b += m;
        RGB.r *= 255;
        RGB.g *= 255;
        RGB.b *= 255;
        return RGB.color();
    };
    Utils.HSBtoNumber = function (hue, saturation, brightness, radians) {
        if (hue === undefined) {
            hue = 0;
        }
        if (saturation === undefined) {
            saturation = 75;
        }
        if (brightness === undefined) {
            brightness = 75;
        }
        if (radians === undefined) {
            radians = false;
        }
        if (radians) {
            hue *= 180 / Math.PI;
        }
        var h, s, v, r, g, b, i, f, p, q, t;
        h = hue / 360;
        s = saturation / 100;
        v = brightness / 100;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
    };
    Utils.prototype.parseColor = function (color, toNumber) {
        if (toNumber === true) {
            if (typeof color === 'number') {
                return (color | 0);
            }
            if (typeof color === 'string' && color[0] === '#') {
                color = color.slice(1);
            }
            return parseInt(color, 16);
        }
        else {
            if (typeof color === 'number') {
                color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
            }
            return color;
        }
    };
    Utils.containsPoint = function (rect, x, y) {
        return !(x < rect.x || x > rect.x + rect.width ||
            y < rect.y || y > rect.y + rect.height);
    };
    Utils.angleNormalize = function (angle) {
        return Math.atan2(Math.sin(angle), Math.cos(angle));
    };
    return Utils;
}());
exports.default = Utils;
function eventPositionCapture(x, y, event, element) {
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    }
    else {
        x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= element.offsetLeft;
    y -= element.offsetTop;
    return {
        x: x,
        y: y
    };
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector2d_1 = __webpack_require__(0);
var BoundingBox = (function () {
    function BoundingBox(options) {
        this.bound = {
            max: null,
            min: null,
        };
        options = options || {};
        this.bound.min = options.lowerBound ? vector2d_1.default.clone(options.lowerBound) : new vector2d_1.default();
        this.bound.max = options.upperBound ? vector2d_1.default.clone(options.upperBound) : new vector2d_1.default();
    }
    BoundingBox.overlaps = function (boxA, boxB) {
        return (vector2d_1.default.isLessOrEqual(boxA.bound.min, boxB.bound.max) &&
            vector2d_1.default.isLessOrEqual(boxB.bound.min, boxA.bound.max));
    };
    BoundingBox.prototype.extend = function (box) {
        var max = this.bound.max;
        var min = this.bound.min;
        if (vector2d_1.default.isGreater(max, box.bound.max)) {
            max = box.bound.max;
        }
        if (vector2d_1.default.isLess(min, box.bound.min)) {
            min = box.bound.min;
        }
    };
    BoundingBox.prototype.draw = function (context) {
        context.save();
        context.translate(this.bound.min.getX(), this.bound.min.getY());
        context.beginPath();
        context.rect(0, 0, this.bound.max.getX() - this.bound.min.getX(), this.bound.max.getY() - this.bound.min.getY());
        context.lineWidth = 0.5;
        context.strokeStyle = "#00ff00";
        context.stroke();
        context.restore();
    };
    return BoundingBox;
}());
exports.default = BoundingBox;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rectangle_1 = __webpack_require__(5);
var Node = (function () {
    function Node(bounds, depth, maxDepth, maxChildren) {
        this.nodes = null;
        this.children = null;
        this.bounds = null;
        this.classConstructor = Node;
        this.depth = 0;
        this.maxChildren = 4;
        this.maxDepth = 4;
        this.bounds = bounds;
        this.children = [];
        this.nodes = [];
    }
    Node.prototype.insert = function (item) {
        if (this.nodes.length) {
            var index = this.findIndex(item);
            this.nodes[index].insert(item);
            return;
        }
        this.children.push(item);
        var len = this.children.length;
        if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
            this.subdivide();
            for (var i = 0; i < len; i++) {
                this.insert(this.children[i]);
            }
            this.children.length = 0;
        }
    };
    Node.prototype.retrieve = function (item) {
        if (this.nodes.length) {
            var index = this.findIndex(item);
            return this.nodes[index].retrieve(item);
        }
        return this.children;
    };
    Node.prototype.subdivide = function () {
        var depth = this.depth + 1;
        var bx = this.bounds.x;
        var by = this.bounds.y;
        var b_w_h = (this.bounds.width / 2);
        var b_h_h = (this.bounds.height / 2);
        var bx_b_w_h = bx + b_w_h;
        var by_b_h_h = by + b_h_h;
        this.nodes[Node.TOP_LEFT] = new this.classConstructor(new rectangle_1.default(bx, by, b_w_h, b_h_h), depth, this.maxDepth, this.maxChildren);
        this.nodes[Node.TOP_RIGHT] = new this.classConstructor(new rectangle_1.default(bx_b_w_h, by, b_w_h, b_h_h), depth, this.maxDepth, this.maxChildren);
        this.nodes[Node.BOTTOM_LEFT] = new this.classConstructor(new rectangle_1.default(bx, by_b_h_h, b_w_h, b_h_h), depth, this.maxDepth, this.maxChildren);
        this.nodes[Node.BOTTOM_RIGHT] = new this.classConstructor(new rectangle_1.default(bx_b_w_h, by_b_h_h, b_w_h, b_h_h), depth, this.maxDepth, this.maxChildren);
    };
    Node.prototype.clear = function () {
        this.children.length = 0;
        var len = this.nodes.length;
        for (var i = 0; i < len; i++) {
            this.nodes[i].clear();
        }
        this.nodes.length = 0;
    };
    Node.prototype.draw = function (context) {
        var bounds = this.bounds;
        bounds.draw(context);
        var len = this.nodes.length;
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.draw(context);
        }
    };
    Node.prototype.findIndex = function (item) {
        var b = this.bounds;
        var left = (item.position.x > b.x + b.width / 2) ? false : true;
        var top = (item.position.y > b.y + b.height / 2) ? false : true;
        var index = Node.TOP_LEFT;
        if (left) {
            if (!top) {
                index = Node.BOTTOM_LEFT;
            }
        }
        else {
            if (top) {
                index = Node.TOP_RIGHT;
            }
            else {
                index = Node.BOTTOM_RIGHT;
            }
        }
        return index;
    };
    Node.TOP_LEFT = 0;
    Node.TOP_RIGHT = 1;
    Node.BOTTOM_LEFT = 2;
    Node.BOTTOM_RIGHT = 3;
    return Node;
}());
exports.default = Node;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle = (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.draw = function (context) {
        context.save();
        context.translate(this.x, this.y);
        context.scale(1, 1);
        context.lineWidth = 2;
        context.strokeStyle = "#2B2B2B";
        context.globalAlpha = 1;
        context.save();
        context.beginPath();
        context.rect(0, 0, this.width, this.height);
        context.stroke();
        context.restore();
        context.restore();
    };
    return Rectangle;
}());
exports.default = Rectangle;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector2d_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
var tank_1 = __webpack_require__(8);
var box_1 = __webpack_require__(9);
var camera_1 = __webpack_require__(10);
var quad_tree_1 = __webpack_require__(11);
var rectangle_1 = __webpack_require__(5);
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var mouse = utils_1.default.captureMouse(canvas);
var keyboard = utils_1.default.captureKeyboard(window);
var log = document.getElementById("log");
var tanks = [];
var tanksAmount = 9;
var player = 0;
for (var i = 0; i < tanksAmount; i++) {
    tanks.push(new tank_1.default(Math.random() * 1000, Math.random() * 1000));
    tanks[i].color = utils_1.default.HSBtoRGB(Math.random() * 360, 75, 75);
}
var box = new box_1.default();
var cam = new camera_1.default();
var bounds = new rectangle_1.default(0, 0, 1000, 1000);
var tree = new quad_tree_1.default(bounds, false, 7);
var camTarget = new vector2d_1.default(canvas.width / 2, canvas.height / 2);
var easing = 0.08;
(function drawFrame() {
    window.requestAnimationFrame(drawFrame, canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (keyboard.x.pressed) {
        keyboard.x.pressed = false;
        if (player < tanksAmount - 1) {
            player++;
        }
        else {
            player = 0;
        }
    }
    if (keyboard.z.pressed) {
        keyboard.z.pressed = false;
        if (player - 1 > -1) {
            player--;
        }
        else {
            player = tanksAmount - 1;
        }
    }
    tanks[player].player(keyboard, mouse, cam);
    cam.manipulation(keyboard, mouse);
    var v = (tanks[player].position.sub(camTarget)).mult(easing);
    camTarget = camTarget.add(v);
    cam.focusing(canvas, camTarget);
    context.save();
    cam.draw(context);
    context.fillStyle = "green";
    context.fillRect(1, 1, 100, 100);
    context.fillRect(-432, -153, 100, 100);
    context.fillRect(-565, 300, 100, 100);
    context.fillRect(123, -215, 100, 100);
    context.fillRect(-133, 132, 100, 100);
    for (var _i = 0, tanks_1 = tanks; _i < tanks_1.length; _i++) {
        var tank = tanks_1[_i];
        tank.update();
        tank.updateBoundingBox();
        tank.draw(context);
        tank.boundingBox.draw(context);
    }
    tanks[player].drawHelp(context);
    box.draw(context);
    tree.bruteForce(tanks);
    tree.draw(context);
    context.restore();
    log.value = null;
    log.value += "--- canvas ---" + "\n";
    log.value += "cam " + cam.toString() + "\n";
    log.value += "--- tank ---" + "\n";
    log.value += "play tank #" + player + "\n";
    log.value += "tank " + tanks[player].toString() + "\n";
})();


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(2);
var vector2d_1 = __webpack_require__(0);
var AABB_1 = __webpack_require__(3);
var Tank = (function () {
    function Tank(x, y) {
        this.position = new vector2d_1.default();
        this.color = utils_1.default.HSBtoRGB(360, 75, 75);
        this.direction = new vector2d_1.default();
        this.rotation = 0;
        this.speed = 5;
        this.positionRotation = 0;
        this.target = new vector2d_1.default();
        this.targetRotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.lineWidth = 2;
        this.transparency = 1;
        this.width = 5;
        this.height = 5;
        this.radius = 20;
        this.isColliding = false;
        this.isCollidingboundingBox = false;
        this.option = {
            lowerBound: null,
            upperBound: null,
        };
        this.object = {
            gun: {
                length: 30,
                width: 10,
                turretRadius: 10,
            },
            tank: {
                length: 40,
                width: 30,
            },
            tank2: [
                new vector2d_1.default(-20, -15),
                new vector2d_1.default(20, -15),
                new vector2d_1.default(20, 15),
                new vector2d_1.default(-20, 15),
                new vector2d_1.default(20, 0),
            ],
        };
        this.pull = new vector2d_1.default(x, y) || new vector2d_1.default();
    }
    Tank.prototype.player = function (keyboard, mouse, camera) {
        this.targetRotation = vector2d_1.default.angleTo(this.target.set(mouse), camera.targeting(this.position)) - camera.rotation;
        var speed = 0;
        if (keyboard.up.pressed || keyboard.w.pressed) {
            this.direction = this.direction.add(vector2d_1.default.fromAngle(-Math.PI / 2 - camera.rotation));
            speed = this.speed;
        }
        if (keyboard.down.pressed || keyboard.s.pressed) {
            this.direction = this.direction.add(vector2d_1.default.fromAngle(Math.PI / 2 - camera.rotation));
            speed = this.speed;
        }
        if (keyboard.left.pressed || keyboard.a.pressed) {
            this.direction = this.direction.add(vector2d_1.default.fromAngle(Math.PI - camera.rotation));
            speed = this.speed;
        }
        if (keyboard.right.pressed || keyboard.d.pressed) {
            this.direction = this.direction.add(vector2d_1.default.fromAngle(0 - camera.rotation));
            speed = this.speed;
        }
        this.direction = this.direction.normalize();
        this.pull = this.pull.add(this.direction.mult(speed));
    };
    Tank.prototype.update = function () {
        this.positionRotation = vector2d_1.default.angleTo(this.pull, this.position);
        this.position.x = this.pull.x - Math.cos(this.positionRotation) * 18;
        this.position.y = this.pull.y - Math.sin(this.positionRotation) * 18;
    };
    Tank.prototype.updateBoundingBox = function () {
        var tankRotated = [];
        for (var _i = 0, _a = this.object.tank2; _i < _a.length; _i++) {
            var point = _a[_i];
            tankRotated.push(vector2d_1.default.rotateAbout(vector2d_1.default.clone(this.position).add(point), this.positionRotation, this.position));
        }
        var min = vector2d_1.default.clone(this.position);
        var max = vector2d_1.default.clone(this.position);
        for (var _b = 0, tankRotated_1 = tankRotated; _b < tankRotated_1.length; _b++) {
            var point = tankRotated_1[_b];
            if (point.getX() < min.getX()) {
                min.setX(point.getX());
            }
            if (point.getY() < min.getY()) {
                min.setY(point.getY());
            }
            if (point.getX() > max.getX()) {
                max.setX(point.getX());
            }
            if (point.getY() > max.getY()) {
                max.setY(point.getY());
            }
        }
        this.tankRotated = tankRotated;
        this.option.lowerBound = min;
        this.option.upperBound = max;
        this.boundingBox = new AABB_1.default(this.option);
    };
    Tank.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.fillStyle = this.color;
        if (this.isColliding) {
            ctx.strokeStyle = "#c40000";
            this.isColliding = false;
        }
        else {
            ctx.strokeStyle = "#191919";
        }
        ctx.globalAlpha = this.transparency;
        ctx.save();
        ctx.rotate(this.positionRotation);
        this.tank2Path(ctx);
        ctx.restore();
        ctx.save();
        ctx.rotate(this.targetRotation);
        this.gunPath(ctx);
        ctx.restore();
        ctx.restore();
    };
    Tank.prototype.drawHelp = function (ctx) {
        var scale = 1;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.moveTo(0, 0);
        ctx.fillStyle = "#ff0000";
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 0.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.scale(scale, scale);
        function pointDraw(rotation, positionX, positionY) {
            if (rotation === undefined) {
                rotation = 0;
            }
            if (positionX === undefined) {
                positionX = 0;
            }
            if (positionY === undefined) {
                positionY = 0;
            }
            ctx.save();
            ctx.beginPath();
            ctx.rotate(rotation);
            ctx.arc(positionX, positionY, 2, 0, (Math.PI * 2), false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function arcAngleDraw(angle1, angle2, radius) {
            if (angle1 === undefined) {
                angle1 = 0;
            }
            if (angle2 === undefined) {
                angle2 = 0;
            }
            if (radius === undefined) {
                radius = 10;
            }
            angle1 = utils_1.default.angleNormalize(angle1);
            angle2 = utils_1.default.angleNormalize(angle2);
            var difference = angle1 - angle2;
            ctx.save();
            ctx.beginPath();
            if (Math.sin(difference) > 0) {
                ctx.arc(0, 0, radius, (angle1), (angle2), true);
            }
            else {
                ctx.arc(0, 0, radius, (angle1), (angle2), false);
            }
            ctx.stroke();
            ctx.restore();
        }
        ctx.save();
        ctx.beginPath();
        ctx.rotate(this.positionRotation);
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.rotate(this.targetRotation);
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        arcAngleDraw(this.targetRotation, this.positionRotation, 50);
        ctx.restore();
    };
    Tank.prototype.toString = function () {
        return "position: " + this.position.toString() + "\n" +
            "pull: " + this.pull.toString() + "\n" +
            "direction: " + this.direction.toString() + "\n" +
            "targetRotation: " + this.targetRotation.toFixed(2) + "\n" +
            "positionRotation: " + this.positionRotation.toFixed(2) + "\n" +
            "rotation: " + this.rotation.toFixed(2) + "\n" +
            "BoundingBox: " + this.boundingBox.bound.min.toString() + "\n" +
            "option.lowerBound: " + this.option.lowerBound.toString() + "\n" +
            "option.upperBound: " + this.option.upperBound.toString() + "\n" +
            "tankRotated: " + "\n" +
            this.tankRotated[0].toString() + "\n" +
            this.tankRotated[1].toString() + "\n" +
            this.tankRotated[2].toString() + "\n" +
            this.tankRotated[3].toString() + "\n" +
            this.tankRotated[4].toString() + "\n";
    };
    Tank.prototype.tankPath = function (ctx) {
        ctx.beginPath();
        ctx.rect(-this.object.tank.length / 2, -this.object.tank.width / 2, this.object.tank.length, this.object.tank.width);
        ctx.moveTo(this.object.tank.length / 2, 0);
        ctx.lineTo(-this.object.tank.length / 2, this.object.tank.width / 2);
        ctx.lineTo(-this.object.tank.length / 2, -this.object.tank.width / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Tank.prototype.tank2Path = function (ctx) {
        var draw = this.object.tank2;
        ctx.beginPath();
        ctx.moveTo(draw[0].x, draw[0].y);
        ctx.lineTo(draw[1].x, draw[1].y);
        ctx.lineTo(draw[2].x, draw[2].y);
        ctx.lineTo(draw[3].x, draw[3].y);
        ctx.closePath();
        ctx.moveTo(draw[4].x, 0);
        ctx.lineTo(draw[3].x, draw[3].y);
        ctx.lineTo(draw[0].x, draw[0].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    Tank.prototype.gunPath = function (ctx) {
        ctx.beginPath();
        ctx.rect(0, -this.object.gun.width / 2, this.object.gun.length, this.object.gun.width);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.object.gun.turretRadius, 0, (Math.PI * 2), false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    return Tank;
}());
exports.default = Tank;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Box = (function () {
    function Box() {
        this.x = 200;
        this.y = 200;
        this.size = { height: 45, width: 45 };
        this.color = "#9C9C9C";
    }
    Box.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(1, 1);
        ctx.lineWidth = 3;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#2B2B2B";
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.beginPath();
        ctx.rect(-this.size.height / 2, -this.size.width / 2, this.size.height, this.size.width);
        ctx.moveTo(this.size.height / 2, this.size.width / 2);
        ctx.lineTo(-this.size.height / 2, -this.size.width / 2);
        ctx.moveTo(-this.size.height / 2, this.size.width / 2);
        ctx.lineTo(this.size.height / 2, -this.size.width / 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
    };
    return Box;
}());
exports.default = Box;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector2d_1 = __webpack_require__(0);
var Camera = (function () {
    function Camera(position, zoom, rotation) {
        this.position = position || new vector2d_1.default();
        this.zoom = zoom || 1;
        this.rotation = rotation || 0;
        this.focus = new vector2d_1.default();
    }
    Camera.prototype.targeting = function (target) {
        return target.mult(this.zoom).rotate(this.rotation).add(this.position);
    };
    Camera.prototype.manipulation = function (keyboard, mouse) {
        if (keyboard.NumpadAdd.pressed || mouse.WheelUp.pressed) {
            this.zoom *= 1.1;
        }
        if (keyboard.NumpadSub.pressed || mouse.WheelDown.pressed) {
            this.zoom /= 1.1;
        }
        if (keyboard.e.pressed) {
            this.rotation -= 0.1;
        }
        if (keyboard.q.pressed) {
            this.rotation += 0.1;
        }
    };
    Camera.prototype.focusing = function (canvas, focus) {
        if (focus === undefined) {
            focus = new vector2d_1.default();
        }
        this.focus.set(canvas.width / 2, canvas.height / 2);
        this.position = this.position.set(focus.positioning(this));
    };
    Camera.prototype.focusingEasing = function (focus) {
    };
    Camera.prototype.draw = function (context) {
        context.translate(this.position.x, this.position.y);
        context.scale(this.zoom, this.zoom);
        context.rotate(this.rotation);
    };
    Camera.prototype.toString = function () {
        return this.position.toString() +
            "zoom: " + this.zoom + "\n" +
            "rotation: " + this.rotation + "\n";
    };
    return Camera;
}());
exports.default = Camera;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __webpack_require__(4);
var bounds_node_1 = __webpack_require__(12);
var AABB_1 = __webpack_require__(3);
var QuadTree = (function () {
    function QuadTree(bounds, pointQuad, maxDepth, maxChildren) {
        this.root = null;
        var node;
        if (pointQuad) {
            node = new node_1.default(bounds, 0, maxDepth, maxChildren);
        }
        else {
            node = new bounds_node_1.default(bounds, 0, maxDepth, maxChildren);
        }
        this.root = node;
    }
    QuadTree.prototype.insert = function (item) {
        if (item instanceof Array) {
            var len = item.length;
            for (var i = 0; i < len; i++) {
                this.root.insert(item[i]);
            }
        }
        else {
            this.root.insert(item);
        }
    };
    QuadTree.prototype.clear = function () {
        this.root.clear();
    };
    QuadTree.prototype.retrieve = function (item) {
        var out = this.root.retrieve(item).slice(0);
        return out;
    };
    QuadTree.prototype.draw = function (context) {
        var bounds = this.root.bounds;
        bounds.draw(context);
        var len = this.root.nodes.length;
        for (var _i = 0, _a = this.root.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.draw(context);
        }
    };
    QuadTree.prototype.boundingBox = function (items) {
        this.clear();
        this.insert(items);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var itemsB = this.retrieve(item);
            for (var _a = 0, itemsB_1 = itemsB; _a < itemsB_1.length; _a++) {
                var itemB = itemsB_1[_a];
                if (item === itemB) {
                    continue;
                }
                if (item.isColliding && itemB.isColliding) {
                    continue;
                }
                if (AABB_1.default.overlaps(item.boundingBox, itemB.boundingBox)) {
                    item.isColliding = true;
                    itemB.isColliding = true;
                }
            }
        }
    };
    QuadTree.prototype.boundingCircle = function (items) {
        this.clear();
        this.insert(items);
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var item = items_2[_i];
            var itemsB = this.retrieve(item);
            for (var _a = 0, itemsB_2 = itemsB; _a < itemsB_2.length; _a++) {
                var itemB = itemsB_2[_a];
                if (item === itemB) {
                    continue;
                }
                if (item.isColliding && itemB.isColliding) {
                    continue;
                }
                var d = item.position.sub(itemB.position);
                var radii = item.radius + itemB.radius;
                var colliding = d.magSq() < (radii * radii);
                if (!item.isColliding) {
                    item.isColliding = colliding;
                }
                if (!itemB.isColliding) {
                    itemB.isColliding = colliding;
                }
            }
        }
    };
    QuadTree.prototype.bruteForce = function (items) {
        for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
            var item = items_3[_i];
            for (var _a = 0, items_4 = items; _a < items_4.length; _a++) {
                var itemB = items_4[_a];
                if (item === itemB) {
                    continue;
                }
                if (item.isColliding && itemB.isColliding) {
                    continue;
                }
                if (AABB_1.default.overlaps(item.boundingBox, itemB.boundingBox)) {
                    item.isColliding = true;
                    itemB.isColliding = true;
                }
            }
        }
    };
    return QuadTree;
}());
exports.default = QuadTree;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __webpack_require__(4);
var BoundsNode = (function (_super) {
    __extends(BoundsNode, _super);
    function BoundsNode(bounds, depth, maxDepth, maxChildren) {
        var _this = _super.call(this, bounds, depth, maxDepth, maxChildren) || this;
        _this.classConstructor = BoundsNode;
        _this.stuckChildren = null;
        _this.out = [];
        _this.stuckChildren = [];
        return _this;
    }
    BoundsNode.prototype.insert = function (item) {
        if (this.nodes.length) {
            var index = this.findIndex(item);
            var node = this.nodes[index];
            if (item.position.x >= node.bounds.x &&
                item.position.x + item.width <= node.bounds.x + node.bounds.width &&
                item.position.y >= node.bounds.y &&
                item.position.y + item.height <= node.bounds.y + node.bounds.height) {
                this.nodes[index].insert(item);
            }
            else {
                this.stuckChildren.push(item);
            }
            return;
        }
        this.children.push(item);
        var len = this.children.length;
        if (!(this.depth >= this.maxDepth) && len > this.maxChildren) {
            this.subdivide();
            for (var i = 0; i < len; i++) {
                this.insert(this.children[i]);
            }
            this.children.length = 0;
        }
    };
    BoundsNode.prototype.getChildren = function () {
        return this.children.concat(this.stuckChildren);
    };
    BoundsNode.prototype.retrieve = function (item) {
        var out = this.out;
        out.length = 0;
        if (this.nodes.length) {
            var index = this.findIndex(item);
            var node = this.nodes[index];
            if (item.position.x >= node.bounds.x &&
                item.position.x + item.width <= node.bounds.x + node.bounds.width &&
                item.position.y >= node.bounds.y &&
                item.position.y + item.height <= node.bounds.y + node.bounds.height) {
                out.push.apply(out, this.nodes[index].retrieve(item));
            }
            else {
                if (item.position.x <= this.nodes[node_1.default.TOP_RIGHT].bounds.x) {
                    if (item.position.y <= this.nodes[node_1.default.BOTTOM_LEFT].bounds.y) {
                        out.push.apply(out, this.nodes[node_1.default.TOP_LEFT].getAllContent());
                    }
                    if (item.position.y + item.height > this.nodes[node_1.default.BOTTOM_LEFT].bounds.y) {
                        out.push.apply(out, this.nodes[node_1.default.BOTTOM_LEFT].getAllContent());
                    }
                }
                if (item.position.x + item.width > this.nodes[node_1.default.TOP_RIGHT].bounds.x) {
                    if (item.position.y <= this.nodes[node_1.default.BOTTOM_RIGHT].bounds.y) {
                        out.push.apply(out, this.nodes[node_1.default.TOP_RIGHT].getAllContent());
                    }
                    if (item.position.y + item.height > this.nodes[node_1.default.BOTTOM_RIGHT].bounds.y) {
                        out.push.apply(out, this.nodes[node_1.default.BOTTOM_RIGHT].getAllContent());
                    }
                }
            }
        }
        out.push.apply(out, this.stuckChildren);
        out.push.apply(out, this.children);
        return out;
    };
    BoundsNode.prototype.getAllContent = function () {
        var out = this.out;
        if (this.nodes.length) {
            for (var i = 0; i < this.nodes.length; i++) {
                this.nodes[i].getAllContent();
            }
        }
        out.push.apply(out, this.stuckChildren);
        out.push.apply(out, this.children);
        return out;
    };
    BoundsNode.prototype.clear = function () {
        this.stuckChildren.length = 0;
        this.children.length = 0;
        var len = this.nodes.length;
        if (!len) {
            return;
        }
        for (var i = 0; i < len; i++) {
            this.nodes[i].clear();
        }
        this.nodes.length = 0;
    };
    return BoundsNode;
}(node_1.default));
exports.default = BoundsNode;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.main.js.map