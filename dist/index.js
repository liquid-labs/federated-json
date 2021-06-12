'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _typeof = unwrapExports(_typeof_1);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayLikeToArray);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
* Package internal utility functions.
*/
var replaceRE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
/**
* Replaces constructs like '${FOO}' with the environment value of 'FOO' (or whatever key is used). Will raise an
* exception if no value is found for a given key.
*/

var envTemplateString = function envTemplateString(path) {
  var origPath = path; // used for error messages

  var matches; // A replaced var may itself reference vars, so we keep processing until everything is resolved.

  while ((matches = _toConsumableArray(path.matchAll(replaceRE))).length > 0) {
    // const matches = [...path.matchAll(replaceRE)]
    matches.reverse(); // The reverse allows us to use the start and end indexes without messing up the string.

    var _iterator = _createForOfIteratorHelper(matches),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var matchInfo = _step.value;
        var match = matchInfo[0];
        var key = matchInfo[1];
        var value = process.env[key];
        var matchStart = matchInfo.index;

        if (value === undefined) {
          throw new Error("No such environment parameter '".concat(key, "' found in path replacement: '").concat(origPath, "'."));
        }

        path = path.substring(0, matchStart) + value + path.substring(matchStart + match.length);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return path;
};
/**
* Returns true if pathA is on pathB. I.e., if pathB is or under pathA. E.g.:
* - ('.', '.foo') => true
* - ('.foo', '.') => false
* - ('.foo', '.foo') => true
*
* Note, this function assumes the paths are valid JSON paths.
*/


var testJsonPaths = function testJsonPaths(pathA, pathB) {
  if (typeof pathA !== 'string' && !(pathA instanceof String) || typeof pathB !== 'string' && !(pathB instanceof String)) {
    throw new Error("Unexpected non-string input: '".concat(pathA, "', '").concat(pathB, "'"));
  }

  var pathABits = pathA.split('.');
  var pathBBits = pathB.split('.');

  if (pathABits.length > pathBBits.length) {
    return false;
  }

  while (pathABits[0] === '') {
    pathABits.shift();
  }

  while (pathBBits[0] === '') {
    pathBBits.shift();
  }

  if (pathABits.length > pathBBits.length) {
    return false;
  }

  while (pathABits.length > 0) {
    var aBit = pathABits.shift();
    var bBit = pathBBits.shift();

    if (bBit !== aBit) {
      return false;
    }
  }

  return true;
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var FJSON_META_DATA_KEY = 'com.liquid-labs.federated-json';
/**
* Adds or updates a mount point entry. WARNING: This method does not currently support sub-mounts. These must be
* manually updated by accessing the sub-data structure and modifying it's mount points directly.
*/

var addMountPoint = function addMountPoint(data, dataPath, dataFile) {
  var mountSpecs = getMountSpecs(data);

  if (mountSpecs === undefined) {
    mountSpecs = [];
    var myMeta = ensureMyMeta(data);

    if (myMeta.mountSpecs === undefined) {
      myMeta.mountSpecs = mountSpecs;
    }
  }

  var i = mountSpecs.findIndex(function (el) {
    return el.dataPath === dataPath;
  });
  var mountSpec = {
    dataPath: dataPath,
    dataFile: dataFile
  };

  if (i !== -1) {
    mountSpecs[i] = mountSpec;
  } else {
    mountSpecs.push(mountSpec);
  }
};

var jsonRE = /\.json$/;
/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files.
*/

var readFJSON = function readFJSON(filePath, options) {
  if (!filePath) {
    throw new Error("File path invalid. (".concat(filePath, ")"));
  }

  var _ref = options || {},
      rememberSource = _ref.rememberSource;

  var processedPath = envTemplateString(filePath);

  if (!fs.existsSync(processedPath)) {
    var msg = "No such file: '".concat(filePath, "'") + (filePath !== processedPath ? " ('".concat(processedPath, "')") : '');
    throw new Error(msg);
  }

  var dataBits = fs.readFileSync(processedPath);
  var data; // actually, would love 'const', but need to set inside try block and don'w want to expand scope of the try.

  try {
    data = JSON.parse(dataBits);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new SyntaxError("".concat(e.message, " while processing ").concat(filePath));
    }
  }

  if (rememberSource) {
    setSource(data, filePath);
  }

  var _iterator = _createForOfIteratorHelper$1(getMountSpecs(data) || []),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mntSpec = _step.value;

      var _processMountSpec = processMountSpec({
        mntSpec: mntSpec,
        data: data
      }),
          dataFile = _processMountSpec.dataFile,
          dataDir = _processMountSpec.dataDir,
          mountPoint = _processMountSpec.mountPoint,
          finalKey = _processMountSpec.finalKey;

      if (dataFile) {
        var subData = readFJSON(dataFile);
        mountPoint[finalKey] = subData;
      } else {
        // 'dataDir' is good because we expect processMountSpec() to raise an exception if neither specified.
        var mntObj = {};
        mountPoint[finalKey] = mntObj;
        var files = fs.readdirSync(dataDir, {
          withFileTypes: true
        }).filter(function (item) {
          return !item.isDirectory() && jsonRE.test(item.name);
        }).map(function (item) {
          return item.name;
        }); // note 'name' is the simple/basename, not the whole path.

        var _iterator3 = _createForOfIteratorHelper$1(files),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var dirFile = _step3.value;
            var mntPnt = dirFile.replace(jsonRE, '');

            var _subData = readFJSON(path.join(dataDir, dirFile));

            mntObj[mntPnt] = _subData;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper$1(getLinkSpecs(data) || []),
      _step2;

  try {
    var _loop = function _loop() {
      var lnkSpec = _step2.value;

      var _processLinkSpec = processLinkSpec(lnkSpec, data),
          finalRef = _processLinkSpec.finalRef,
          source = _processLinkSpec.source,
          keyName = _processLinkSpec.keyName,
          penultimateRef = _processLinkSpec.penultimateRef,
          finalKey = _processLinkSpec.finalKey;

      var getRealItem = function getRealItem(soure, keyName, key) {
        return source.find(function (candidate) {
          return candidate[keyName] === key;
        }) || function (e) {
          throw e;
        }(new Error("Cannot find link '".concat(key, "' in '").concat(lnkSpec.linkTo, "'.")));
      };

      if (Array.isArray(finalRef)) {
        // replace the contents
        var realItems = finalRef.map(function (key) {
          return getRealItem(source, keyName, key);
        });
        finalRef.splice.apply(finalRef, [0, finalRef.length].concat(_toConsumableArray(realItems)));
      } else if (_typeof(finalRef) === 'object') {
        for (var _i = 0, _Object$keys = Object.keys(finalRef); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          finalRef[key] = getRealItem(source, keyName, key);
        }
      } else {
        // it's a single key
        penultimateRef[finalKey] = getRealItem(source, keyName, finalRef);
      }
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return data;
};
/**
* Set's the meta source information.
*/


var setSource = function setSource(data, filePath) {
  var myMeta = ensureMyMeta(data);
  myMeta.sourceFile = filePath;
};
/**
* Writes a standard or federated JSON file by analysing the objects meta data and breaking the saved files up
* accourding to the configuration.
*/


var writeFJSON = function writeFJSON(_ref2) {
  var data = _ref2.data,
      filePath = _ref2.filePath,
      saveFrom = _ref2.saveFrom,
      jsonPathToSelf = _ref2.jsonPathToSelf;

  if (filePath === undefined) {
    var myMeta = getMyMeta(data);
    filePath = myMeta && myMeta.sourceFile;

    if (!filePath) {
      throw new Error("File was not provided and no 'meta.sourceFile' defined (or invalid).");
    }
  }

  var doSave = saveFrom === undefined || jsonPathToSelf && testJsonPaths(saveFrom, jsonPathToSelf);

  if (doSave && !filePath) {
    throw new Error('No explicit filePath provided and no source found in object meta data.');
  }

  var mountSpecs = getMountSpecs(data);

  if (mountSpecs) {
    var _iterator4 = _createForOfIteratorHelper$1(mountSpecs),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var mntSpec = _step4.value;

        var _processMountSpec2 = processMountSpec({
          mntSpec: mntSpec,
          data: data,
          preserveOriginal: true
        }),
            dataFile = _processMountSpec2.dataFile,
            dataDir = _processMountSpec2.dataDir,
            dataPath = _processMountSpec2.dataPath,
            mountPoint = _processMountSpec2.mountPoint,
            finalKey = _processMountSpec2.finalKey,
            newData = _processMountSpec2.newData;

        data = newData;
        var subData = mountPoint[finalKey];
        mountPoint[finalKey] = null; // What's our save scheme? Single data file, or a scan dir?

        if (dataFile) {
          writeFJSON({
            data: subData,
            filePath: dataFile,
            saveFrom: saveFrom,
            jsonPathToSelf: updatejsonPathToSelf(dataPath, jsonPathToSelf)
          });
        } else {
          // processMountSpec will raise an exception if neither dataFile nor dataDir is defined.
          // We don't bother to test what 'dataDir' is. If it exists, we won't overwrite, so the subsequent attempt to
          // write a file into it can just fail if it's not of an appropriate type.
          fs.existsSync(dataDir) || fs.mkdirSync(dataDir);

          for (var _i2 = 0, _Object$keys2 = Object.keys(subData); _i2 < _Object$keys2.length; _i2++) {
            var subKey = _Object$keys2[_i2];
            writeFJSON({
              data: subData[subKey],
              filePath: path.join(dataDir, "".concat(subKey, ".json")),
              saveFrom: saveFrom,
              jsonPathToSelf: updatejsonPathToSelf("".concat(dataPath, ".").concat(subKey), jsonPathToSelf)
            });
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }

  if (doSave) {
    var dataString = JSON.stringify(data, null, '  ');
    var processedPath = envTemplateString(filePath);
    fs.writeFileSync(processedPath, dataString);
  }
};

var getMyMeta = function getMyMeta(data) {
  return data._meta && data._meta[FJSON_META_DATA_KEY];
};

var ensureMyMeta = function ensureMyMeta(data) {
  var myMeta = getMyMeta(data);

  if (!myMeta) {
    if (data._meta === undefined) {
      data._meta = {};
    }

    if (data._meta[FJSON_META_DATA_KEY] === undefined) {
      data._meta[FJSON_META_DATA_KEY] = {};
    }

    myMeta = getMyMeta(data);
  }

  return myMeta;
};
/**
* Updates (by returning) the new dynamic path given the current data path (relative to a data mount or link point) and
* previous dynamic path.
*/


var updatejsonPathToSelf = function updatejsonPathToSelf(jsonMountPath, jsonPathToSelf) {
  if (jsonMountPath !== undefined) {
    return jsonPathToSelf === undefined ? jsonMountPath : "".concat(jsonPathToSelf).concat(jsonMountPath);
  } else {
    return undefined;
  }
};
/**
* Internal function to test for and extract mount specs from the provided JSON object.
*/


var getMountSpecs = function getMountSpecs(data) {
  var _getMyMeta;

  return (_getMyMeta = getMyMeta(data)) === null || _getMyMeta === void 0 ? void 0 : _getMyMeta.mountSpecs;
};
/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/


var processMountSpec = function processMountSpec(_ref3) {
  var mntSpec = _ref3.mntSpec,
      data = _ref3.data,
      preserveOriginal = _ref3.preserveOriginal;
  var dataPath = mntSpec.dataPath,
      dataFile = mntSpec.dataFile,
      dataDir = mntSpec.dataDir;
  dataFile && dataDir // eslint-disable-line no-unused-expressions
  && function (e) {
    throw e;
  }(new Error("Bad mount spec; cannot specify both data file (".concat(dataFile, ") and directory (").concat(dataDir, ")")));
  !dataFile && !dataDir // eslint-disable-line no-unused-expressions
  && function (e) {
    throw e;
  }(new Error('Bad mount spec; neither data file nor directory.'));
  dataFile && (dataFile = envTemplateString(dataFile));
  dataDir && (dataDir = envTemplateString(dataDir));

  var _processJSONPath = processJSONPath({
    path: dataPath,
    data: data,
    preserveOriginal: preserveOriginal
  }),
      mountPoint = _processJSONPath.penultimateRef,
      finalKey = _processJSONPath.finalKey,
      newData = _processJSONPath.newData;

  return {
    dataFile: dataFile,
    dataDir: dataDir,
    dataPath: dataPath,
    mountPoint: mountPoint,
    finalKey: finalKey,
    newData: newData
  };
};
/**
* Internal function to test for and extract link specs from the provided JSON object.
*/


var getLinkSpecs = function getLinkSpecs(data) {
  var _getMyMeta2;

  return (_getMyMeta2 = getMyMeta(data)) === null || _getMyMeta2 === void 0 ? void 0 : _getMyMeta2.linkSpecs;
};
/**
* Internal function to process a link spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/


var processLinkSpec = function processLinkSpec(lnkSpec, data) {
  var linkRefs = lnkSpec.linkRefs,
      linkTo = lnkSpec.linkTo,
      keyName = lnkSpec.linkKey;

  var _processJSONPath2 = processJSONPath({
    path: linkRefs,
    data: data
  }),
      finalRef = _processJSONPath2.finalRef,
      penultimateRef = _processJSONPath2.penultimateRef,
      finalKey = _processJSONPath2.finalKey;

  var _processJSONPath3 = processJSONPath({
    path: linkTo,
    data: data
  }),
      source = _processJSONPath3.finalRef;

  return {
    finalRef: finalRef,
    source: source,
    keyName: keyName,
    penultimateRef: penultimateRef,
    finalKey: finalKey
  };
};

var shallowCopy = function shallowCopy(input) {
  return Array.isArray(input) ? input.slice() : _typeof(input) === 'object' && input !== null ? Object.assign({}, input) : input;
};

var processJSONPath = function processJSONPath(_ref4) {
  var path = _ref4.path,
      data = _ref4.data,
      preserveOriginal = _ref4.preserveOriginal;

  if (!path) {
    throw new Error("No 'dataPath' specified for mount spec mount point.");
  }

  var pathTrail = path.split('.');
  pathTrail.shift();
  var finalKey = pathTrail.pop();
  var newData = preserveOriginal ? shallowCopy(data) : data;
  var penultimateRef = newData; // not necessarily penultimate yet, but will be...

  var _iterator5 = _createForOfIteratorHelper$1(pathTrail),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var key = _step5.value;

      if (preserveOriginal) {
        var result = shallowCopy(penultimateRef[key]);
        penultimateRef[key] = result;
        penultimateRef = result;
      } else {
        penultimateRef = penultimateRef[key];
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  return {
    finalRef: penultimateRef[finalKey],
    penultimateRef: penultimateRef,
    finalKey: finalKey,
    newData: newData
  };
}; // aliases for 'import * as fjson; fjson.write()' style


var write = writeFJSON;
var read = readFJSON;

exports.FJSON_META_DATA_KEY = FJSON_META_DATA_KEY;
exports.addMountPoint = addMountPoint;
exports.read = read;
exports.readFJSON = readFJSON;
exports.setSource = setSource;
exports.write = write;
exports.writeFJSON = writeFJSON;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhvdXRIb2xlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVTcHJlYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheS5qcyIsIi4uL3NyYy9saWIvdXRpbHMuanMiLCIuLi9zcmMvbGliL2ZlZGVyYXRlZC1qc29uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3R5cGVvZjtcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5TGlrZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5LmpzXCIpO1xuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aG91dEhvbGVzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVTcHJlYWQ7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXMuanNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXkuanNcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzXCIpO1xuXG52YXIgbm9uSXRlcmFibGVTcHJlYWQgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVNwcmVhZC5qc1wiKTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIi8qKlxuKiBQYWNrYWdlIGludGVybmFsIHV0aWxpdHkgZnVuY3Rpb25zLlxuKi9cbmNvbnN0IHJlcGxhY2VSRSA9IC9cXCRcXHsoW0EtWmEtel9dW0EtWmEtejAtOV9dKilcXH0vZ1xuXG4vKipcbiogUmVwbGFjZXMgY29uc3RydWN0cyBsaWtlICcke0ZPT30nIHdpdGggdGhlIGVudmlyb25tZW50IHZhbHVlIG9mICdGT08nIChvciB3aGF0ZXZlciBrZXkgaXMgdXNlZCkuIFdpbGwgcmFpc2UgYW5cbiogZXhjZXB0aW9uIGlmIG5vIHZhbHVlIGlzIGZvdW5kIGZvciBhIGdpdmVuIGtleS5cbiovXG5jb25zdCBlbnZUZW1wbGF0ZVN0cmluZyA9IChwYXRoKSA9PiB7XG4gIGNvbnN0IG9yaWdQYXRoID0gcGF0aCAvLyB1c2VkIGZvciBlcnJvciBtZXNzYWdlc1xuXG4gIGxldCBtYXRjaGVzIC8vIEEgcmVwbGFjZWQgdmFyIG1heSBpdHNlbGYgcmVmZXJlbmNlIHZhcnMsIHNvIHdlIGtlZXAgcHJvY2Vzc2luZyB1bnRpbCBldmVyeXRoaW5nIGlzIHJlc29sdmVkLlxuICB3aGlsZSAoKG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXSkubGVuZ3RoID4gMCkge1xuICAgIC8vIGNvbnN0IG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXVxuICAgIG1hdGNoZXMucmV2ZXJzZSgpIC8vIFRoZSByZXZlcnNlIGFsbG93cyB1cyB0byB1c2UgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kZXhlcyB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIHN0cmluZy5cbiAgICBmb3IgKGNvbnN0IG1hdGNoSW5mbyBvZiBtYXRjaGVzKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IG1hdGNoSW5mb1swXVxuICAgICAgY29uc3Qga2V5ID0gbWF0Y2hJbmZvWzFdXG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2Nlc3MuZW52W2tleV1cbiAgICAgIGNvbnN0IG1hdGNoU3RhcnQgPSBtYXRjaEluZm8uaW5kZXhcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBlbnZpcm9ubWVudCBwYXJhbWV0ZXIgJyR7a2V5fScgZm91bmQgaW4gcGF0aCByZXBsYWNlbWVudDogJyR7b3JpZ1BhdGh9Jy5gKVxuICAgICAgfVxuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIG1hdGNoU3RhcnQpICsgdmFsdWUgKyBwYXRoLnN1YnN0cmluZyhtYXRjaFN0YXJ0ICsgbWF0Y2gubGVuZ3RoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuKiBSZXR1cm5zIHRydWUgaWYgcGF0aEEgaXMgb24gcGF0aEIuIEkuZS4sIGlmIHBhdGhCIGlzIG9yIHVuZGVyIHBhdGhBLiBFLmcuOlxuKiAtICgnLicsICcuZm9vJykgPT4gdHJ1ZVxuKiAtICgnLmZvbycsICcuJykgPT4gZmFsc2VcbiogLSAoJy5mb28nLCAnLmZvbycpID0+IHRydWVcbipcbiogTm90ZSwgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoZSBwYXRocyBhcmUgdmFsaWQgSlNPTiBwYXRocy5cbiovXG5jb25zdCB0ZXN0SnNvblBhdGhzID0gKHBhdGhBLCBwYXRoQikgPT4ge1xuICBpZiAoKHR5cGVvZiBwYXRoQSAhPT0gJ3N0cmluZycgJiYgIShwYXRoQSBpbnN0YW5jZW9mIFN0cmluZykpXG4gICAgICB8fCAodHlwZW9mIHBhdGhCICE9PSAnc3RyaW5nJyAmJiAhKHBhdGhCIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbm9uLXN0cmluZyBpbnB1dDogJyR7cGF0aEF9JywgJyR7cGF0aEJ9J2ApXG4gIH1cbiAgY29uc3QgcGF0aEFCaXRzID0gcGF0aEEuc3BsaXQoJy4nKVxuICBjb25zdCBwYXRoQkJpdHMgPSBwYXRoQi5zcGxpdCgnLicpXG4gIGlmIChwYXRoQUJpdHMubGVuZ3RoID4gcGF0aEJCaXRzLmxlbmd0aCkgeyByZXR1cm4gZmFsc2UgfVxuXG4gIHdoaWxlIChwYXRoQUJpdHNbMF0gPT09ICcnKSB7IHBhdGhBQml0cy5zaGlmdCgpIH1cbiAgd2hpbGUgKHBhdGhCQml0c1swXSA9PT0gJycpIHsgcGF0aEJCaXRzLnNoaWZ0KCkgfVxuICBpZiAocGF0aEFCaXRzLmxlbmd0aCA+IHBhdGhCQml0cy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlIH1cblxuICB3aGlsZSAocGF0aEFCaXRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBhQml0ID0gcGF0aEFCaXRzLnNoaWZ0KClcbiAgICBjb25zdCBiQml0ID0gcGF0aEJCaXRzLnNoaWZ0KClcblxuICAgIGlmIChiQml0ICE9PSBhQml0KSB7IHJldHVybiBmYWxzZSB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgeyBlbnZUZW1wbGF0ZVN0cmluZywgdGVzdEpzb25QYXRocyB9XG4iLCIvKipcbiogTGlicmFyeSB0aGF0IGJ1aWxkcyBhIHNpbmdsZSBKU09OIG9iamVjdCBmcm9tIG11bHRpcGxlIEpTT04gZmlsZXMuIEFzIGVhY2ggZmlsZSBpcyBsb2FkZWQsIHdlIGNoZWNrXG4qIGBfbWV0YS9jb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWRhdGEvbW91bnRTcGVjc2AuIEVhY2ggc3BlYyBjb25zaXN0cyBvZiBhIGBkYXRhUGF0aGAgYW5kIGBkYXRhRmlsZWAgZWxlbWVudC4gVGhlXG4qIGRhdGEgcGF0aCBpcyBzcGxpdCBvbiAnLycgYW5kIGVhY2ggZWxlbWVudCBpcyB0cmVhdGVkIGFzIGEgc3RyaW5nLiBUaGVyZWZvcmUsIHRoZSBwYXRoIGlzIGNvbXBhdGlibGUgd2l0aCBvYmplY3Qga2V5c1xuKiBidXQgZG9lcyBub3Qgc3VwcG9ydCBhcnJheXMuXG4qL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5cbmltcG9ydCB7IGVudlRlbXBsYXRlU3RyaW5nLCB0ZXN0SnNvblBhdGhzIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgRkpTT05fTUVUQV9EQVRBX0tFWSA9ICdjb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWpzb24nXG5cbi8qKlxuKiBBZGRzIG9yIHVwZGF0ZXMgYSBtb3VudCBwb2ludCBlbnRyeS4gV0FSTklORzogVGhpcyBtZXRob2QgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgc3ViLW1vdW50cy4gVGhlc2UgbXVzdCBiZVxuKiBtYW51YWxseSB1cGRhdGVkIGJ5IGFjY2Vzc2luZyB0aGUgc3ViLWRhdGEgc3RydWN0dXJlIGFuZCBtb2RpZnlpbmcgaXQncyBtb3VudCBwb2ludHMgZGlyZWN0bHkuXG4qL1xuY29uc3QgYWRkTW91bnRQb2ludCA9IChkYXRhLCBkYXRhUGF0aCwgZGF0YUZpbGUpID0+IHtcbiAgbGV0IG1vdW50U3BlY3MgPSBnZXRNb3VudFNwZWNzKGRhdGEpXG5cbiAgaWYgKG1vdW50U3BlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vdW50U3BlY3MgPSBbXVxuICAgIGNvbnN0IG15TWV0YSA9IGVuc3VyZU15TWV0YShkYXRhKVxuICAgIGlmIChteU1ldGEubW91bnRTcGVjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBteU1ldGEubW91bnRTcGVjcyA9IG1vdW50U3BlY3NcbiAgICB9XG4gIH1cblxuICBjb25zdCBpID0gbW91bnRTcGVjcy5maW5kSW5kZXgoKGVsKSA9PiBlbC5kYXRhUGF0aCA9PT0gZGF0YVBhdGgpXG4gIGNvbnN0IG1vdW50U3BlYyA9IHsgZGF0YVBhdGggOiBkYXRhUGF0aCwgZGF0YUZpbGUgfVxuICBpZiAoaSAhPT0gLTEpIHtcbiAgICBtb3VudFNwZWNzW2ldID0gbW91bnRTcGVjXG4gIH1cbiAgZWxzZSB7XG4gICAgbW91bnRTcGVjcy5wdXNoKG1vdW50U3BlYylcbiAgfVxufVxuXG5jb25zdCBqc29uUkUgPSAvXFwuanNvbiQvXG5cbi8qKlxuKiBSZWFkcyBhIEpTT04gZmlsZSBhbmQgcHJvY2Vzc2VzIGZvciBmZWRlcmF0ZWQgbW91bnQgcG9pbnRzIHRvIGNvbnN0cnVjdCBhIGNvbXBvc2l0ZSBKU09OIG9iamVjdCBmcm9tIG9uZSBvciBtb3JlXG4qIGZpbGVzLlxuKi9cbmNvbnN0IHJlYWRGSlNPTiA9IChmaWxlUGF0aCwgb3B0aW9ucykgPT4ge1xuICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcihgRmlsZSBwYXRoIGludmFsaWQuICgke2ZpbGVQYXRofSlgKSB9XG5cbiAgY29uc3QgeyByZW1lbWJlclNvdXJjZSB9ID0gb3B0aW9ucyB8fCB7fVxuXG4gIGNvbnN0IHByb2Nlc3NlZFBhdGggPSBlbnZUZW1wbGF0ZVN0cmluZyhmaWxlUGF0aClcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHByb2Nlc3NlZFBhdGgpKSB7XG4gICAgY29uc3QgbXNnID0gYE5vIHN1Y2ggZmlsZTogJyR7ZmlsZVBhdGh9J2AgKyAoZmlsZVBhdGggIT09IHByb2Nlc3NlZFBhdGggPyBgICgnJHtwcm9jZXNzZWRQYXRofScpYCA6ICcnKVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gIH1cbiAgY29uc3QgZGF0YUJpdHMgPSBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzc2VkUGF0aClcbiAgbGV0IGRhdGEgLy8gYWN0dWFsbHksIHdvdWxkIGxvdmUgJ2NvbnN0JywgYnV0IG5lZWQgdG8gc2V0IGluc2lkZSB0cnkgYmxvY2sgYW5kIGRvbid3IHdhbnQgdG8gZXhwYW5kIHNjb3BlIG9mIHRoZSB0cnkuXG4gIHRyeSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YUJpdHMpXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYCR7ZS5tZXNzYWdlfSB3aGlsZSBwcm9jZXNzaW5nICR7ZmlsZVBhdGh9YClcbiAgICB9XG4gIH1cblxuICBpZiAocmVtZW1iZXJTb3VyY2UpIHtcbiAgICBzZXRTb3VyY2UoZGF0YSwgZmlsZVBhdGgpXG4gIH1cblxuICBmb3IgKGNvbnN0IG1udFNwZWMgb2YgZ2V0TW91bnRTcGVjcyhkYXRhKSB8fCBbXSkge1xuICAgIGNvbnN0IHsgZGF0YUZpbGUsIGRhdGFEaXIsIG1vdW50UG9pbnQsIGZpbmFsS2V5IH0gPSBwcm9jZXNzTW91bnRTcGVjKHsgbW50U3BlYywgZGF0YSB9KVxuICAgIGlmIChkYXRhRmlsZSkge1xuICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihkYXRhRmlsZSlcblxuICAgICAgbW91bnRQb2ludFtmaW5hbEtleV0gPSBzdWJEYXRhXG4gICAgfVxuICAgIGVsc2UgeyAvLyAnZGF0YURpcicgaXMgZ29vZCBiZWNhdXNlIHdlIGV4cGVjdCBwcm9jZXNzTW91bnRTcGVjKCkgdG8gcmFpc2UgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgc3BlY2lmaWVkLlxuICAgICAgY29uc3QgbW50T2JqID0ge31cbiAgICAgIG1vdW50UG9pbnRbZmluYWxLZXldID0gbW50T2JqXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGF0YURpciwgeyB3aXRoRmlsZVR5cGVzIDogdHJ1ZSB9KVxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uaXNEaXJlY3RvcnkoKSAmJiBqc29uUkUudGVzdChpdGVtLm5hbWUpKVxuICAgICAgICAubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKSAvLyBub3RlICduYW1lJyBpcyB0aGUgc2ltcGxlL2Jhc2VuYW1lLCBub3QgdGhlIHdob2xlIHBhdGguXG5cbiAgICAgIGZvciAoY29uc3QgZGlyRmlsZSBvZiBmaWxlcykge1xuICAgICAgICBjb25zdCBtbnRQbnQgPSBkaXJGaWxlLnJlcGxhY2UoanNvblJFLCAnJylcbiAgICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihwYXRoLmpvaW4oZGF0YURpciwgZGlyRmlsZSkpXG4gICAgICAgIG1udE9ialttbnRQbnRdID0gc3ViRGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgbG5rU3BlYyBvZiBnZXRMaW5rU3BlY3MoZGF0YSkgfHwgW10pIHtcbiAgICBjb25zdCB7IGZpbmFsUmVmLCBzb3VyY2UsIGtleU5hbWUsIHBlbnVsdGltYXRlUmVmLCBmaW5hbEtleSB9ID0gcHJvY2Vzc0xpbmtTcGVjKGxua1NwZWMsIGRhdGEpXG5cbiAgICBjb25zdCBnZXRSZWFsSXRlbSA9IChzb3VyZSwga2V5TmFtZSwga2V5KSA9PlxuICAgICAgc291cmNlLmZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlW2tleU5hbWVdID09PSBrZXkpXG4gICAgICAgIHx8IHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbGluayAnJHtrZXl9JyBpbiAnJHtsbmtTcGVjLmxpbmtUb30nLmApXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaW5hbFJlZikpIHsgLy8gcmVwbGFjZSB0aGUgY29udGVudHNcbiAgICAgIGNvbnN0IHJlYWxJdGVtcyA9IGZpbmFsUmVmLm1hcCgoa2V5KSA9PiBnZXRSZWFsSXRlbShzb3VyY2UsIGtleU5hbWUsIGtleSkpXG4gICAgICBmaW5hbFJlZi5zcGxpY2UoMCwgZmluYWxSZWYubGVuZ3RoLCAuLi5yZWFsSXRlbXMpXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBmaW5hbFJlZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGZpbmFsUmVmKSkge1xuICAgICAgICBmaW5hbFJlZltrZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBrZXkpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBpdCdzIGEgc2luZ2xlIGtleVxuICAgICAgcGVudWx0aW1hdGVSZWZbZmluYWxLZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBmaW5hbFJlZilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YVxufVxuXG4vKipcbiogU2V0J3MgdGhlIG1ldGEgc291cmNlIGluZm9ybWF0aW9uLlxuKi9cbmNvbnN0IHNldFNvdXJjZSA9IChkYXRhLCBmaWxlUGF0aCkgPT4ge1xuICBjb25zdCBteU1ldGEgPSBlbnN1cmVNeU1ldGEoZGF0YSlcbiAgbXlNZXRhLnNvdXJjZUZpbGUgPSBmaWxlUGF0aFxufVxuXG4vKipcbiogV3JpdGVzIGEgc3RhbmRhcmQgb3IgZmVkZXJhdGVkIEpTT04gZmlsZSBieSBhbmFseXNpbmcgdGhlIG9iamVjdHMgbWV0YSBkYXRhIGFuZCBicmVha2luZyB0aGUgc2F2ZWQgZmlsZXMgdXBcbiogYWNjb3VyZGluZyB0byB0aGUgY29uZmlndXJhdGlvbi5cbiovXG5jb25zdCB3cml0ZUZKU09OID0gKHsgZGF0YSwgZmlsZVBhdGgsIHNhdmVGcm9tLCBqc29uUGF0aFRvU2VsZiB9KSA9PiB7XG4gIGlmIChmaWxlUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbXlNZXRhID0gZ2V0TXlNZXRhKGRhdGEpXG4gICAgZmlsZVBhdGggPSBteU1ldGEgJiYgbXlNZXRhLnNvdXJjZUZpbGVcbiAgICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcihgRmlsZSB3YXMgbm90IHByb3ZpZGVkIGFuZCBubyAnbWV0YS5zb3VyY2VGaWxlJyBkZWZpbmVkIChvciBpbnZhbGlkKS5gKSB9XG4gIH1cblxuICBjb25zdCBkb1NhdmUgPSBzYXZlRnJvbSA9PT0gdW5kZWZpbmVkIHx8IChqc29uUGF0aFRvU2VsZiAmJiB0ZXN0SnNvblBhdGhzKHNhdmVGcm9tLCBqc29uUGF0aFRvU2VsZikpXG4gIGlmIChkb1NhdmUgJiYgIWZpbGVQYXRoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBleHBsaWNpdCBmaWxlUGF0aCBwcm92aWRlZCBhbmQgbm8gc291cmNlIGZvdW5kIGluIG9iamVjdCBtZXRhIGRhdGEuJylcbiAgfVxuXG4gIGNvbnN0IG1vdW50U3BlY3MgPSBnZXRNb3VudFNwZWNzKGRhdGEpXG4gIGlmIChtb3VudFNwZWNzKSB7XG4gICAgZm9yIChjb25zdCBtbnRTcGVjIG9mIG1vdW50U3BlY3MpIHtcbiAgICAgIGNvbnN0IHsgZGF0YUZpbGUsIGRhdGFEaXIsIGRhdGFQYXRoLCBtb3VudFBvaW50LCBmaW5hbEtleSwgbmV3RGF0YSB9ID1cbiAgICAgICAgcHJvY2Vzc01vdW50U3BlYyh7IG1udFNwZWMsIGRhdGEsIHByZXNlcnZlT3JpZ2luYWwgOiB0cnVlIH0pXG4gICAgICBkYXRhID0gbmV3RGF0YVxuXG4gICAgICBjb25zdCBzdWJEYXRhID0gbW91bnRQb2ludFtmaW5hbEtleV1cbiAgICAgIG1vdW50UG9pbnRbZmluYWxLZXldID0gbnVsbFxuICAgICAgLy8gV2hhdCdzIG91ciBzYXZlIHNjaGVtZT8gU2luZ2xlIGRhdGEgZmlsZSwgb3IgYSBzY2FuIGRpcj9cbiAgICAgIGlmIChkYXRhRmlsZSkge1xuICAgICAgICB3cml0ZUZKU09OKHtcbiAgICAgICAgICBkYXRhICAgICAgICAgICA6IHN1YkRhdGEsXG4gICAgICAgICAgZmlsZVBhdGggICAgICAgOiBkYXRhRmlsZSxcbiAgICAgICAgICBzYXZlRnJvbSxcbiAgICAgICAgICBqc29uUGF0aFRvU2VsZiA6IHVwZGF0ZWpzb25QYXRoVG9TZWxmKGRhdGFQYXRoLCBqc29uUGF0aFRvU2VsZilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgeyAvLyBwcm9jZXNzTW91bnRTcGVjIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgZGF0YUZpbGUgbm9yIGRhdGFEaXIgaXMgZGVmaW5lZC5cbiAgICAgICAgLy8gV2UgZG9uJ3QgYm90aGVyIHRvIHRlc3Qgd2hhdCAnZGF0YURpcicgaXMuIElmIGl0IGV4aXN0cywgd2Ugd29uJ3Qgb3ZlcndyaXRlLCBzbyB0aGUgc3Vic2VxdWVudCBhdHRlbXB0IHRvXG4gICAgICAgIC8vIHdyaXRlIGEgZmlsZSBpbnRvIGl0IGNhbiBqdXN0IGZhaWwgaWYgaXQncyBub3Qgb2YgYW4gYXBwcm9wcmlhdGUgdHlwZS5cbiAgICAgICAgZnMuZXhpc3RzU3luYyhkYXRhRGlyKSB8fCBmcy5ta2RpclN5bmMoZGF0YURpcilcblxuICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzdWJEYXRhKSkge1xuICAgICAgICAgIHdyaXRlRkpTT04oe1xuICAgICAgICAgICAgZGF0YSAgICAgICAgICAgOiBzdWJEYXRhW3N1YktleV0sXG4gICAgICAgICAgICBmaWxlUGF0aCAgICAgICA6IHBhdGguam9pbihkYXRhRGlyLCBgJHtzdWJLZXl9Lmpzb25gKSxcbiAgICAgICAgICAgIHNhdmVGcm9tLFxuICAgICAgICAgICAganNvblBhdGhUb1NlbGYgOiB1cGRhdGVqc29uUGF0aFRvU2VsZihgJHtkYXRhUGF0aH0uJHtzdWJLZXl9YCwganNvblBhdGhUb1NlbGYpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkb1NhdmUpIHtcbiAgICBjb25zdCBkYXRhU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgJyAgJylcbiAgICBjb25zdCBwcm9jZXNzZWRQYXRoID0gZW52VGVtcGxhdGVTdHJpbmcoZmlsZVBhdGgpXG4gICAgZnMud3JpdGVGaWxlU3luYyhwcm9jZXNzZWRQYXRoLCBkYXRhU3RyaW5nKVxuICB9XG59XG5cbmNvbnN0IGdldE15TWV0YSA9IChkYXRhKSA9PiBkYXRhLl9tZXRhICYmIGRhdGEuX21ldGFbRkpTT05fTUVUQV9EQVRBX0tFWV1cblxuY29uc3QgZW5zdXJlTXlNZXRhID0gKGRhdGEpID0+IHtcbiAgbGV0IG15TWV0YSA9IGdldE15TWV0YShkYXRhKVxuICBpZiAoIW15TWV0YSkge1xuICAgIGlmIChkYXRhLl9tZXRhID09PSB1bmRlZmluZWQpIHsgZGF0YS5fbWV0YSA9IHt9IH1cbiAgICBpZiAoZGF0YS5fbWV0YVtGSlNPTl9NRVRBX0RBVEFfS0VZXSA9PT0gdW5kZWZpbmVkKSB7IGRhdGEuX21ldGFbRkpTT05fTUVUQV9EQVRBX0tFWV0gPSB7fSB9XG4gICAgbXlNZXRhID0gZ2V0TXlNZXRhKGRhdGEpXG4gIH1cblxuICByZXR1cm4gbXlNZXRhXG59XG5cbi8qKlxuKiBVcGRhdGVzIChieSByZXR1cm5pbmcpIHRoZSBuZXcgZHluYW1pYyBwYXRoIGdpdmVuIHRoZSBjdXJyZW50IGRhdGEgcGF0aCAocmVsYXRpdmUgdG8gYSBkYXRhIG1vdW50IG9yIGxpbmsgcG9pbnQpIGFuZFxuKiBwcmV2aW91cyBkeW5hbWljIHBhdGguXG4qL1xuY29uc3QgdXBkYXRlanNvblBhdGhUb1NlbGYgPSAoanNvbk1vdW50UGF0aCwganNvblBhdGhUb1NlbGYpID0+IHtcbiAgaWYgKGpzb25Nb3VudFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBqc29uUGF0aFRvU2VsZiA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGpzb25Nb3VudFBhdGhcbiAgICAgIDogYCR7anNvblBhdGhUb1NlbGZ9JHtqc29uTW91bnRQYXRofWBcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cbn1cblxuLyoqXG4qIEludGVybmFsIGZ1bmN0aW9uIHRvIHRlc3QgZm9yIGFuZCBleHRyYWN0IG1vdW50IHNwZWNzIGZyb20gdGhlIHByb3ZpZGVkIEpTT04gb2JqZWN0LlxuKi9cbmNvbnN0IGdldE1vdW50U3BlY3MgPSAoZGF0YSkgPT4gZ2V0TXlNZXRhKGRhdGEpPy5tb3VudFNwZWNzXG5cbi8qKlxuKiBJbnRlcm5hbCBmdW5jdGlvbiB0byBwcm9jZXNzIGEgbW91bnQgc3BlYyBpbnRvIHVzZWZ1bCBjb21wb25lbnRzIHV0aWxpemVkIGJ5IHRoZSBgcmVhZEZKU09OYCBhbmQgYHdyaXRlRkpTT05gLlxuKi9cbmNvbnN0IHByb2Nlc3NNb3VudFNwZWMgPSAoeyBtbnRTcGVjLCBkYXRhLCBwcmVzZXJ2ZU9yaWdpbmFsIH0pID0+IHtcbiAgbGV0IHsgZGF0YVBhdGgsIGRhdGFGaWxlLCBkYXRhRGlyIH0gPSBtbnRTcGVjXG5cbiAgZGF0YUZpbGUgJiYgZGF0YURpciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICYmIHRocm93IG5ldyBFcnJvcihgQmFkIG1vdW50IHNwZWM7IGNhbm5vdCBzcGVjaWZ5IGJvdGggZGF0YSBmaWxlICgke2RhdGFGaWxlfSkgYW5kIGRpcmVjdG9yeSAoJHtkYXRhRGlyfSlgKVxuICAhZGF0YUZpbGUgJiYgIWRhdGFEaXIgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAmJiB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBtb3VudCBzcGVjOyBuZWl0aGVyIGRhdGEgZmlsZSBub3IgZGlyZWN0b3J5LicpXG5cbiAgZGF0YUZpbGUgJiYgKGRhdGFGaWxlID0gZW52VGVtcGxhdGVTdHJpbmcoZGF0YUZpbGUpKVxuICBkYXRhRGlyICYmIChkYXRhRGlyID0gZW52VGVtcGxhdGVTdHJpbmcoZGF0YURpcikpXG5cbiAgY29uc3QgeyBwZW51bHRpbWF0ZVJlZjogbW91bnRQb2ludCwgZmluYWxLZXksIG5ld0RhdGEgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBkYXRhUGF0aCwgZGF0YSwgcHJlc2VydmVPcmlnaW5hbCB9KVxuXG4gIHJldHVybiB7IGRhdGFGaWxlLCBkYXRhRGlyLCBkYXRhUGF0aCwgbW91bnRQb2ludCwgZmluYWxLZXksIG5ld0RhdGEgfVxufVxuXG4vKipcbiogSW50ZXJuYWwgZnVuY3Rpb24gdG8gdGVzdCBmb3IgYW5kIGV4dHJhY3QgbGluayBzcGVjcyBmcm9tIHRoZSBwcm92aWRlZCBKU09OIG9iamVjdC5cbiovXG5jb25zdCBnZXRMaW5rU3BlY3MgPSAoZGF0YSkgPT4gZ2V0TXlNZXRhKGRhdGEpPy5saW5rU3BlY3NcblxuLyoqXG4qIEludGVybmFsIGZ1bmN0aW9uIHRvIHByb2Nlc3MgYSBsaW5rIHNwZWMgaW50byB1c2VmdWwgY29tcG9uZW50cyB1dGlsaXplZCBieSB0aGUgYHJlYWRGSlNPTmAgYW5kIGB3cml0ZUZKU09OYC5cbiovXG5jb25zdCBwcm9jZXNzTGlua1NwZWMgPSAobG5rU3BlYywgZGF0YSkgPT4ge1xuICBjb25zdCB7IGxpbmtSZWZzLCBsaW5rVG8sIGxpbmtLZXk6IGtleU5hbWUgfSA9IGxua1NwZWNcblxuICBjb25zdCB7IGZpbmFsUmVmLCBwZW51bHRpbWF0ZVJlZiwgZmluYWxLZXkgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBsaW5rUmVmcywgZGF0YSB9KVxuICBjb25zdCB7IGZpbmFsUmVmOiBzb3VyY2UgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBsaW5rVG8sIGRhdGEgfSlcblxuICByZXR1cm4geyBmaW5hbFJlZiwgc291cmNlLCBrZXlOYW1lLCBwZW51bHRpbWF0ZVJlZiwgZmluYWxLZXkgfVxufVxuXG5jb25zdCBzaGFsbG93Q29weSA9IChpbnB1dCkgPT4gQXJyYXkuaXNBcnJheShpbnB1dClcbiAgPyBpbnB1dC5zbGljZSgpXG4gIDogdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JyAmJiBpbnB1dCAhPT0gbnVsbFxuICAgID8gT2JqZWN0LmFzc2lnbih7fSwgaW5wdXQpXG4gICAgOiBpbnB1dFxuXG5jb25zdCBwcm9jZXNzSlNPTlBhdGggPSAoeyBwYXRoLCBkYXRhLCBwcmVzZXJ2ZU9yaWdpbmFsIH0pID0+IHtcbiAgaWYgKCFwYXRoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gJ2RhdGFQYXRoJyBzcGVjaWZpZWQgZm9yIG1vdW50IHNwZWMgbW91bnQgcG9pbnQuXCIpXG4gIH1cbiAgY29uc3QgcGF0aFRyYWlsID0gcGF0aC5zcGxpdCgnLicpXG4gIHBhdGhUcmFpbC5zaGlmdCgpXG4gIGNvbnN0IGZpbmFsS2V5ID0gcGF0aFRyYWlsLnBvcCgpXG4gIGNvbnN0IG5ld0RhdGEgPSBwcmVzZXJ2ZU9yaWdpbmFsID8gc2hhbGxvd0NvcHkoZGF0YSkgOiBkYXRhXG5cbiAgbGV0IHBlbnVsdGltYXRlUmVmID0gbmV3RGF0YSAvLyBub3QgbmVjZXNzYXJpbHkgcGVudWx0aW1hdGUgeWV0LCBidXQgd2lsbCBiZS4uLlxuICBmb3IgKGNvbnN0IGtleSBvZiBwYXRoVHJhaWwpIHtcbiAgICBpZiAocHJlc2VydmVPcmlnaW5hbCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gc2hhbGxvd0NvcHkocGVudWx0aW1hdGVSZWZba2V5XSlcbiAgICAgIHBlbnVsdGltYXRlUmVmW2tleV0gPSByZXN1bHRcbiAgICAgIHBlbnVsdGltYXRlUmVmID0gcmVzdWx0XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcGVudWx0aW1hdGVSZWYgPSBwZW51bHRpbWF0ZVJlZltrZXldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmaW5hbFJlZiA6IHBlbnVsdGltYXRlUmVmW2ZpbmFsS2V5XSxcbiAgICBwZW51bHRpbWF0ZVJlZixcbiAgICBmaW5hbEtleSxcbiAgICBuZXdEYXRhXG4gIH1cbn1cblxuLy8gYWxpYXNlcyBmb3IgJ2ltcG9ydCAqIGFzIGZqc29uOyBmanNvbi53cml0ZSgpJyBzdHlsZVxuY29uc3Qgd3JpdGUgPSB3cml0ZUZKU09OXG5jb25zdCByZWFkID0gcmVhZEZKU09OXG5cbmV4cG9ydCB7XG4gIGFkZE1vdW50UG9pbnQsIHJlYWRGSlNPTiwgc2V0U291cmNlLCB3cml0ZUZKU09OLCAvLyBzdGFuZGFyZCBpbnRlcmZhY2VcbiAgRkpTT05fTUVUQV9EQVRBX0tFWSwgLy8gcG9zc2libHkgdXNlZnVsPyBtYXkgYmUgcmVtb3ZlZCBiZWZvcmUgJzEuMCdcbiAgd3JpdGUsIHJlYWQgLy8gYWxpYXNlc1xufVxuIl0sIm5hbWVzIjpbInJlcGxhY2VSRSIsImVudlRlbXBsYXRlU3RyaW5nIiwicGF0aCIsIm9yaWdQYXRoIiwibWF0Y2hlcyIsIm1hdGNoQWxsIiwibGVuZ3RoIiwicmV2ZXJzZSIsIm1hdGNoSW5mbyIsIm1hdGNoIiwia2V5IiwidmFsdWUiLCJwcm9jZXNzIiwiZW52IiwibWF0Y2hTdGFydCIsImluZGV4IiwidW5kZWZpbmVkIiwiRXJyb3IiLCJzdWJzdHJpbmciLCJ0ZXN0SnNvblBhdGhzIiwicGF0aEEiLCJwYXRoQiIsIlN0cmluZyIsInBhdGhBQml0cyIsInNwbGl0IiwicGF0aEJCaXRzIiwic2hpZnQiLCJhQml0IiwiYkJpdCIsIkZKU09OX01FVEFfREFUQV9LRVkiLCJhZGRNb3VudFBvaW50IiwiZGF0YSIsImRhdGFQYXRoIiwiZGF0YUZpbGUiLCJtb3VudFNwZWNzIiwiZ2V0TW91bnRTcGVjcyIsIm15TWV0YSIsImVuc3VyZU15TWV0YSIsImkiLCJmaW5kSW5kZXgiLCJlbCIsIm1vdW50U3BlYyIsInB1c2giLCJqc29uUkUiLCJyZWFkRkpTT04iLCJmaWxlUGF0aCIsIm9wdGlvbnMiLCJyZW1lbWJlclNvdXJjZSIsInByb2Nlc3NlZFBhdGgiLCJmcyIsIm1zZyIsImRhdGFCaXRzIiwiSlNPTiIsInBhcnNlIiwiZSIsIlN5bnRheEVycm9yIiwibWVzc2FnZSIsInNldFNvdXJjZSIsIm1udFNwZWMiLCJwcm9jZXNzTW91bnRTcGVjIiwiZGF0YURpciIsIm1vdW50UG9pbnQiLCJmaW5hbEtleSIsInN1YkRhdGEiLCJtbnRPYmoiLCJmaWxlcyIsIndpdGhGaWxlVHlwZXMiLCJmaWx0ZXIiLCJpdGVtIiwiaXNEaXJlY3RvcnkiLCJ0ZXN0IiwibmFtZSIsIm1hcCIsImRpckZpbGUiLCJtbnRQbnQiLCJyZXBsYWNlIiwiZ2V0TGlua1NwZWNzIiwibG5rU3BlYyIsInByb2Nlc3NMaW5rU3BlYyIsImZpbmFsUmVmIiwic291cmNlIiwia2V5TmFtZSIsInBlbnVsdGltYXRlUmVmIiwiZ2V0UmVhbEl0ZW0iLCJzb3VyZSIsImZpbmQiLCJjYW5kaWRhdGUiLCJsaW5rVG8iLCJBcnJheSIsImlzQXJyYXkiLCJyZWFsSXRlbXMiLCJzcGxpY2UiLCJPYmplY3QiLCJrZXlzIiwic291cmNlRmlsZSIsIndyaXRlRkpTT04iLCJzYXZlRnJvbSIsImpzb25QYXRoVG9TZWxmIiwiZ2V0TXlNZXRhIiwiZG9TYXZlIiwicHJlc2VydmVPcmlnaW5hbCIsIm5ld0RhdGEiLCJ1cGRhdGVqc29uUGF0aFRvU2VsZiIsInN1YktleSIsImRhdGFTdHJpbmciLCJzdHJpbmdpZnkiLCJfbWV0YSIsImpzb25Nb3VudFBhdGgiLCJwcm9jZXNzSlNPTlBhdGgiLCJsaW5rU3BlY3MiLCJsaW5rUmVmcyIsImxpbmtLZXkiLCJzaGFsbG93Q29weSIsImlucHV0Iiwic2xpY2UiLCJhc3NpZ24iLCJwYXRoVHJhaWwiLCJwb3AiLCJyZXN1bHQiLCJ3cml0ZSIsInJlYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDdEIsRUFBRSx5QkFBeUIsQ0FBQztBQUM1QjtBQUNBLEVBQUUsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUMzRSxJQUFJLGNBQWMsR0FBRyxPQUFPLEdBQUcsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3JELE1BQU0sT0FBTyxPQUFPLEdBQUcsQ0FBQztBQUN4QixLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLHlCQUF5QixHQUFHLElBQUksQ0FBQztBQUNqRixHQUFHLE1BQU07QUFDVCxJQUFJLGNBQWMsR0FBRyxPQUFPLEdBQUcsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3JELE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTSxJQUFJLEdBQUcsS0FBSyxNQUFNLENBQUMsU0FBUyxHQUFHLFFBQVEsR0FBRyxPQUFPLEdBQUcsQ0FBQztBQUNuSSxLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksTUFBTSxD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
