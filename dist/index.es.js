import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

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

  if (!existsSync(processedPath)) {
    var msg = "No such file: '".concat(filePath, "'") + (filePath !== processedPath ? " ('".concat(processedPath, "')") : '');
    throw new Error(msg);
  }

  var dataBits = readFileSync(processedPath);
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
        var files = readdirSync(dataDir, {
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

            var _subData = readFJSON(join(dataDir, dirFile));

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
          existsSync(dataDir) || mkdirSync(dataDir);

          for (var _i2 = 0, _Object$keys2 = Object.keys(subData); _i2 < _Object$keys2.length; _i2++) {
            var subKey = _Object$keys2[_i2];
            writeFJSON({
              data: subData[subKey],
              filePath: join(dataDir, "".concat(subKey, ".json")),
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
    writeFileSync(processedPath, dataString);
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

export { FJSON_META_DATA_KEY, addMountPoint, read, readFJSON, setSource, write, writeFJSON };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhvdXRIb2xlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVTcHJlYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheS5qcyIsIi4uL3NyYy9saWIvdXRpbHMuanMiLCIuLi9zcmMvbGliL2ZlZGVyYXRlZC1qc29uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3R5cGVvZjtcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5TGlrZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5LmpzXCIpO1xuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aG91dEhvbGVzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVTcHJlYWQ7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXMuanNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXkuanNcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzXCIpO1xuXG52YXIgbm9uSXRlcmFibGVTcHJlYWQgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVNwcmVhZC5qc1wiKTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIi8qKlxuKiBQYWNrYWdlIGludGVybmFsIHV0aWxpdHkgZnVuY3Rpb25zLlxuKi9cbmNvbnN0IHJlcGxhY2VSRSA9IC9cXCRcXHsoW0EtWmEtel9dW0EtWmEtejAtOV9dKilcXH0vZ1xuXG4vKipcbiogUmVwbGFjZXMgY29uc3RydWN0cyBsaWtlICcke0ZPT30nIHdpdGggdGhlIGVudmlyb25tZW50IHZhbHVlIG9mICdGT08nIChvciB3aGF0ZXZlciBrZXkgaXMgdXNlZCkuIFdpbGwgcmFpc2UgYW5cbiogZXhjZXB0aW9uIGlmIG5vIHZhbHVlIGlzIGZvdW5kIGZvciBhIGdpdmVuIGtleS5cbiovXG5jb25zdCBlbnZUZW1wbGF0ZVN0cmluZyA9IChwYXRoKSA9PiB7XG4gIGNvbnN0IG9yaWdQYXRoID0gcGF0aCAvLyB1c2VkIGZvciBlcnJvciBtZXNzYWdlc1xuXG4gIGxldCBtYXRjaGVzIC8vIEEgcmVwbGFjZWQgdmFyIG1heSBpdHNlbGYgcmVmZXJlbmNlIHZhcnMsIHNvIHdlIGtlZXAgcHJvY2Vzc2luZyB1bnRpbCBldmVyeXRoaW5nIGlzIHJlc29sdmVkLlxuICB3aGlsZSAoKG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXSkubGVuZ3RoID4gMCkge1xuICAgIC8vIGNvbnN0IG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXVxuICAgIG1hdGNoZXMucmV2ZXJzZSgpIC8vIFRoZSByZXZlcnNlIGFsbG93cyB1cyB0byB1c2UgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kZXhlcyB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIHN0cmluZy5cbiAgICBmb3IgKGNvbnN0IG1hdGNoSW5mbyBvZiBtYXRjaGVzKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IG1hdGNoSW5mb1swXVxuICAgICAgY29uc3Qga2V5ID0gbWF0Y2hJbmZvWzFdXG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2Nlc3MuZW52W2tleV1cbiAgICAgIGNvbnN0IG1hdGNoU3RhcnQgPSBtYXRjaEluZm8uaW5kZXhcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBlbnZpcm9ubWVudCBwYXJhbWV0ZXIgJyR7a2V5fScgZm91bmQgaW4gcGF0aCByZXBsYWNlbWVudDogJyR7b3JpZ1BhdGh9Jy5gKVxuICAgICAgfVxuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIG1hdGNoU3RhcnQpICsgdmFsdWUgKyBwYXRoLnN1YnN0cmluZyhtYXRjaFN0YXJ0ICsgbWF0Y2gubGVuZ3RoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuKiBSZXR1cm5zIHRydWUgaWYgcGF0aEEgaXMgb24gcGF0aEIuIEkuZS4sIGlmIHBhdGhCIGlzIG9yIHVuZGVyIHBhdGhBLiBFLmcuOlxuKiAtICgnLicsICcuZm9vJykgPT4gdHJ1ZVxuKiAtICgnLmZvbycsICcuJykgPT4gZmFsc2VcbiogLSAoJy5mb28nLCAnLmZvbycpID0+IHRydWVcbipcbiogTm90ZSwgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoZSBwYXRocyBhcmUgdmFsaWQgSlNPTiBwYXRocy5cbiovXG5jb25zdCB0ZXN0SnNvblBhdGhzID0gKHBhdGhBLCBwYXRoQikgPT4ge1xuICBpZiAoKHR5cGVvZiBwYXRoQSAhPT0gJ3N0cmluZycgJiYgIShwYXRoQSBpbnN0YW5jZW9mIFN0cmluZykpXG4gICAgICB8fCAodHlwZW9mIHBhdGhCICE9PSAnc3RyaW5nJyAmJiAhKHBhdGhCIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbm9uLXN0cmluZyBpbnB1dDogJyR7cGF0aEF9JywgJyR7cGF0aEJ9J2ApXG4gIH1cbiAgY29uc3QgcGF0aEFCaXRzID0gcGF0aEEuc3BsaXQoJy4nKVxuICBjb25zdCBwYXRoQkJpdHMgPSBwYXRoQi5zcGxpdCgnLicpXG4gIGlmIChwYXRoQUJpdHMubGVuZ3RoID4gcGF0aEJCaXRzLmxlbmd0aCkgeyByZXR1cm4gZmFsc2UgfVxuXG4gIHdoaWxlIChwYXRoQUJpdHNbMF0gPT09ICcnKSB7IHBhdGhBQml0cy5zaGlmdCgpIH1cbiAgd2hpbGUgKHBhdGhCQml0c1swXSA9PT0gJycpIHsgcGF0aEJCaXRzLnNoaWZ0KCkgfVxuICBpZiAocGF0aEFCaXRzLmxlbmd0aCA+IHBhdGhCQml0cy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlIH1cblxuICB3aGlsZSAocGF0aEFCaXRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBhQml0ID0gcGF0aEFCaXRzLnNoaWZ0KClcbiAgICBjb25zdCBiQml0ID0gcGF0aEJCaXRzLnNoaWZ0KClcblxuICAgIGlmIChiQml0ICE9PSBhQml0KSB7IHJldHVybiBmYWxzZSB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgeyBlbnZUZW1wbGF0ZVN0cmluZywgdGVzdEpzb25QYXRocyB9XG4iLCIvKipcbiogTGlicmFyeSB0aGF0IGJ1aWxkcyBhIHNpbmdsZSBKU09OIG9iamVjdCBmcm9tIG11bHRpcGxlIEpTT04gZmlsZXMuIEFzIGVhY2ggZmlsZSBpcyBsb2FkZWQsIHdlIGNoZWNrXG4qIGBfbWV0YS9jb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWRhdGEvbW91bnRTcGVjc2AuIEVhY2ggc3BlYyBjb25zaXN0cyBvZiBhIGBkYXRhUGF0aGAgYW5kIGBkYXRhRmlsZWAgZWxlbWVudC4gVGhlXG4qIGRhdGEgcGF0aCBpcyBzcGxpdCBvbiAnLycgYW5kIGVhY2ggZWxlbWVudCBpcyB0cmVhdGVkIGFzIGEgc3RyaW5nLiBUaGVyZWZvcmUsIHRoZSBwYXRoIGlzIGNvbXBhdGlibGUgd2l0aCBvYmplY3Qga2V5c1xuKiBidXQgZG9lcyBub3Qgc3VwcG9ydCBhcnJheXMuXG4qL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5cbmltcG9ydCB7IGVudlRlbXBsYXRlU3RyaW5nLCB0ZXN0SnNvblBhdGhzIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgRkpTT05fTUVUQV9EQVRBX0tFWSA9ICdjb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWpzb24nXG5cbi8qKlxuKiBBZGRzIG9yIHVwZGF0ZXMgYSBtb3VudCBwb2ludCBlbnRyeS4gV0FSTklORzogVGhpcyBtZXRob2QgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgc3ViLW1vdW50cy4gVGhlc2UgbXVzdCBiZVxuKiBtYW51YWxseSB1cGRhdGVkIGJ5IGFjY2Vzc2luZyB0aGUgc3ViLWRhdGEgc3RydWN0dXJlIGFuZCBtb2RpZnlpbmcgaXQncyBtb3VudCBwb2ludHMgZGlyZWN0bHkuXG4qL1xuY29uc3QgYWRkTW91bnRQb2ludCA9IChkYXRhLCBkYXRhUGF0aCwgZGF0YUZpbGUpID0+IHtcbiAgbGV0IG1vdW50U3BlY3MgPSBnZXRNb3VudFNwZWNzKGRhdGEpXG5cbiAgaWYgKG1vdW50U3BlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vdW50U3BlY3MgPSBbXVxuICAgIGNvbnN0IG15TWV0YSA9IGVuc3VyZU15TWV0YShkYXRhKVxuICAgIGlmIChteU1ldGEubW91bnRTcGVjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBteU1ldGEubW91bnRTcGVjcyA9IG1vdW50U3BlY3NcbiAgICB9XG4gIH1cblxuICBjb25zdCBpID0gbW91bnRTcGVjcy5maW5kSW5kZXgoKGVsKSA9PiBlbC5kYXRhUGF0aCA9PT0gZGF0YVBhdGgpXG4gIGNvbnN0IG1vdW50U3BlYyA9IHsgZGF0YVBhdGggOiBkYXRhUGF0aCwgZGF0YUZpbGUgfVxuICBpZiAoaSAhPT0gLTEpIHtcbiAgICBtb3VudFNwZWNzW2ldID0gbW91bnRTcGVjXG4gIH1cbiAgZWxzZSB7XG4gICAgbW91bnRTcGVjcy5wdXNoKG1vdW50U3BlYylcbiAgfVxufVxuXG5jb25zdCBqc29uUkUgPSAvXFwuanNvbiQvXG5cbi8qKlxuKiBSZWFkcyBhIEpTT04gZmlsZSBhbmQgcHJvY2Vzc2VzIGZvciBmZWRlcmF0ZWQgbW91bnQgcG9pbnRzIHRvIGNvbnN0cnVjdCBhIGNvbXBvc2l0ZSBKU09OIG9iamVjdCBmcm9tIG9uZSBvciBtb3JlXG4qIGZpbGVzLlxuKi9cbmNvbnN0IHJlYWRGSlNPTiA9IChmaWxlUGF0aCwgb3B0aW9ucykgPT4ge1xuICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcihgRmlsZSBwYXRoIGludmFsaWQuICgke2ZpbGVQYXRofSlgKSB9XG5cbiAgY29uc3QgeyByZW1lbWJlclNvdXJjZSB9ID0gb3B0aW9ucyB8fCB7fVxuXG4gIGNvbnN0IHByb2Nlc3NlZFBhdGggPSBlbnZUZW1wbGF0ZVN0cmluZyhmaWxlUGF0aClcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHByb2Nlc3NlZFBhdGgpKSB7XG4gICAgY29uc3QgbXNnID0gYE5vIHN1Y2ggZmlsZTogJyR7ZmlsZVBhdGh9J2AgKyAoZmlsZVBhdGggIT09IHByb2Nlc3NlZFBhdGggPyBgICgnJHtwcm9jZXNzZWRQYXRofScpYCA6ICcnKVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gIH1cbiAgY29uc3QgZGF0YUJpdHMgPSBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzc2VkUGF0aClcbiAgbGV0IGRhdGEgLy8gYWN0dWFsbHksIHdvdWxkIGxvdmUgJ2NvbnN0JywgYnV0IG5lZWQgdG8gc2V0IGluc2lkZSB0cnkgYmxvY2sgYW5kIGRvbid3IHdhbnQgdG8gZXhwYW5kIHNjb3BlIG9mIHRoZSB0cnkuXG4gIHRyeSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YUJpdHMpXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYCR7ZS5tZXNzYWdlfSB3aGlsZSBwcm9jZXNzaW5nICR7ZmlsZVBhdGh9YClcbiAgICB9XG4gIH1cblxuICBpZiAocmVtZW1iZXJTb3VyY2UpIHtcbiAgICBzZXRTb3VyY2UoZGF0YSwgZmlsZVBhdGgpXG4gIH1cblxuICBmb3IgKGNvbnN0IG1udFNwZWMgb2YgZ2V0TW91bnRTcGVjcyhkYXRhKSB8fCBbXSkge1xuICAgIGNvbnN0IHsgZGF0YUZpbGUsIGRhdGFEaXIsIG1vdW50UG9pbnQsIGZpbmFsS2V5IH0gPSBwcm9jZXNzTW91bnRTcGVjKHsgbW50U3BlYywgZGF0YSB9KVxuICAgIGlmIChkYXRhRmlsZSkge1xuICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihkYXRhRmlsZSlcblxuICAgICAgbW91bnRQb2ludFtmaW5hbEtleV0gPSBzdWJEYXRhXG4gICAgfVxuICAgIGVsc2UgeyAvLyAnZGF0YURpcicgaXMgZ29vZCBiZWNhdXNlIHdlIGV4cGVjdCBwcm9jZXNzTW91bnRTcGVjKCkgdG8gcmFpc2UgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgc3BlY2lmaWVkLlxuICAgICAgY29uc3QgbW50T2JqID0ge31cbiAgICAgIG1vdW50UG9pbnRbZmluYWxLZXldID0gbW50T2JqXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGF0YURpciwgeyB3aXRoRmlsZVR5cGVzIDogdHJ1ZSB9KVxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uaXNEaXJlY3RvcnkoKSAmJiBqc29uUkUudGVzdChpdGVtLm5hbWUpKVxuICAgICAgICAubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKSAvLyBub3RlICduYW1lJyBpcyB0aGUgc2ltcGxlL2Jhc2VuYW1lLCBub3QgdGhlIHdob2xlIHBhdGguXG5cbiAgICAgIGZvciAoY29uc3QgZGlyRmlsZSBvZiBmaWxlcykge1xuICAgICAgICBjb25zdCBtbnRQbnQgPSBkaXJGaWxlLnJlcGxhY2UoanNvblJFLCAnJylcbiAgICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihwYXRoLmpvaW4oZGF0YURpciwgZGlyRmlsZSkpXG4gICAgICAgIG1udE9ialttbnRQbnRdID0gc3ViRGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgbG5rU3BlYyBvZiBnZXRMaW5rU3BlY3MoZGF0YSkgfHwgW10pIHtcbiAgICBjb25zdCB7IGZpbmFsUmVmLCBzb3VyY2UsIGtleU5hbWUsIHBlbnVsdGltYXRlUmVmLCBmaW5hbEtleSB9ID0gcHJvY2Vzc0xpbmtTcGVjKGxua1NwZWMsIGRhdGEpXG5cbiAgICBjb25zdCBnZXRSZWFsSXRlbSA9IChzb3VyZSwga2V5TmFtZSwga2V5KSA9PlxuICAgICAgc291cmNlLmZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlW2tleU5hbWVdID09PSBrZXkpXG4gICAgICAgIHx8IHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbGluayAnJHtrZXl9JyBpbiAnJHtsbmtTcGVjLmxpbmtUb30nLmApXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaW5hbFJlZikpIHsgLy8gcmVwbGFjZSB0aGUgY29udGVudHNcbiAgICAgIGNvbnN0IHJlYWxJdGVtcyA9IGZpbmFsUmVmLm1hcCgoa2V5KSA9PiBnZXRSZWFsSXRlbShzb3VyY2UsIGtleU5hbWUsIGtleSkpXG4gICAgICBmaW5hbFJlZi5zcGxpY2UoMCwgZmluYWxSZWYubGVuZ3RoLCAuLi5yZWFsSXRlbXMpXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBmaW5hbFJlZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGZpbmFsUmVmKSkge1xuICAgICAgICBmaW5hbFJlZltrZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBrZXkpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBpdCdzIGEgc2luZ2xlIGtleVxuICAgICAgcGVudWx0aW1hdGVSZWZbZmluYWxLZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBmaW5hbFJlZilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YVxufVxuXG4vKipcbiogU2V0J3MgdGhlIG1ldGEgc291cmNlIGluZm9ybWF0aW9uLlxuKi9cbmNvbnN0IHNldFNvdXJjZSA9IChkYXRhLCBmaWxlUGF0aCkgPT4ge1xuICBjb25zdCBteU1ldGEgPSBlbnN1cmVNeU1ldGEoZGF0YSlcbiAgbXlNZXRhLnNvdXJjZUZpbGUgPSBmaWxlUGF0aFxufVxuXG4vKipcbiogV3JpdGVzIGEgc3RhbmRhcmQgb3IgZmVkZXJhdGVkIEpTT04gZmlsZSBieSBhbmFseXNpbmcgdGhlIG9iamVjdHMgbWV0YSBkYXRhIGFuZCBicmVha2luZyB0aGUgc2F2ZWQgZmlsZXMgdXBcbiogYWNjb3VyZGluZyB0byB0aGUgY29uZmlndXJhdGlvbi5cbiovXG5jb25zdCB3cml0ZUZKU09OID0gKHsgZGF0YSwgZmlsZVBhdGgsIHNhdmVGcm9tLCBqc29uUGF0aFRvU2VsZiB9KSA9PiB7XG4gIGlmIChmaWxlUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbXlNZXRhID0gZ2V0TXlNZXRhKGRhdGEpXG4gICAgZmlsZVBhdGggPSBteU1ldGEgJiYgbXlNZXRhLnNvdXJjZUZpbGVcbiAgICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcihgRmlsZSB3YXMgbm90IHByb3ZpZGVkIGFuZCBubyAnbWV0YS5zb3VyY2VGaWxlJyBkZWZpbmVkIChvciBpbnZhbGlkKS5gKSB9XG4gIH1cblxuICBjb25zdCBkb1NhdmUgPSBzYXZlRnJvbSA9PT0gdW5kZWZpbmVkIHx8IChqc29uUGF0aFRvU2VsZiAmJiB0ZXN0SnNvblBhdGhzKHNhdmVGcm9tLCBqc29uUGF0aFRvU2VsZikpXG4gIGlmIChkb1NhdmUgJiYgIWZpbGVQYXRoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBleHBsaWNpdCBmaWxlUGF0aCBwcm92aWRlZCBhbmQgbm8gc291cmNlIGZvdW5kIGluIG9iamVjdCBtZXRhIGRhdGEuJylcbiAgfVxuXG4gIGNvbnN0IG1vdW50U3BlY3MgPSBnZXRNb3VudFNwZWNzKGRhdGEpXG4gIGlmIChtb3VudFNwZWNzKSB7XG4gICAgZm9yIChjb25zdCBtbnRTcGVjIG9mIG1vdW50U3BlY3MpIHtcbiAgICAgIGNvbnN0IHsgZGF0YUZpbGUsIGRhdGFEaXIsIGRhdGFQYXRoLCBtb3VudFBvaW50LCBmaW5hbEtleSwgbmV3RGF0YSB9ID1cbiAgICAgICAgcHJvY2Vzc01vdW50U3BlYyh7IG1udFNwZWMsIGRhdGEsIHByZXNlcnZlT3JpZ2luYWwgOiB0cnVlIH0pXG4gICAgICBkYXRhID0gbmV3RGF0YVxuXG4gICAgICBjb25zdCBzdWJEYXRhID0gbW91bnRQb2ludFtmaW5hbEtleV1cbiAgICAgIG1vdW50UG9pbnRbZmluYWxLZXldID0gbnVsbFxuICAgICAgLy8gV2hhdCdzIG91ciBzYXZlIHNjaGVtZT8gU2luZ2xlIGRhdGEgZmlsZSwgb3IgYSBzY2FuIGRpcj9cbiAgICAgIGlmIChkYXRhRmlsZSkge1xuICAgICAgICB3cml0ZUZKU09OKHtcbiAgICAgICAgICBkYXRhICAgICAgICAgICA6IHN1YkRhdGEsXG4gICAgICAgICAgZmlsZVBhdGggICAgICAgOiBkYXRhRmlsZSxcbiAgICAgICAgICBzYXZlRnJvbSxcbiAgICAgICAgICBqc29uUGF0aFRvU2VsZiA6IHVwZGF0ZWpzb25QYXRoVG9TZWxmKGRhdGFQYXRoLCBqc29uUGF0aFRvU2VsZilcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgeyAvLyBwcm9jZXNzTW91bnRTcGVjIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgZGF0YUZpbGUgbm9yIGRhdGFEaXIgaXMgZGVmaW5lZC5cbiAgICAgICAgLy8gV2UgZG9uJ3QgYm90aGVyIHRvIHRlc3Qgd2hhdCAnZGF0YURpcicgaXMuIElmIGl0IGV4aXN0cywgd2Ugd29uJ3Qgb3ZlcndyaXRlLCBzbyB0aGUgc3Vic2VxdWVudCBhdHRlbXB0IHRvXG4gICAgICAgIC8vIHdyaXRlIGEgZmlsZSBpbnRvIGl0IGNhbiBqdXN0IGZhaWwgaWYgaXQncyBub3Qgb2YgYW4gYXBwcm9wcmlhdGUgdHlwZS5cbiAgICAgICAgZnMuZXhpc3RzU3luYyhkYXRhRGlyKSB8fCBmcy5ta2RpclN5bmMoZGF0YURpcilcblxuICAgICAgICBmb3IgKGNvbnN0IHN1YktleSBvZiBPYmplY3Qua2V5cyhzdWJEYXRhKSkge1xuICAgICAgICAgIHdyaXRlRkpTT04oe1xuICAgICAgICAgICAgZGF0YSAgICAgICAgICAgOiBzdWJEYXRhW3N1YktleV0sXG4gICAgICAgICAgICBmaWxlUGF0aCAgICAgICA6IHBhdGguam9pbihkYXRhRGlyLCBgJHtzdWJLZXl9Lmpzb25gKSxcbiAgICAgICAgICAgIHNhdmVGcm9tLFxuICAgICAgICAgICAganNvblBhdGhUb1NlbGYgOiB1cGRhdGVqc29uUGF0aFRvU2VsZihgJHtkYXRhUGF0aH0uJHtzdWJLZXl9YCwganNvblBhdGhUb1NlbGYpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkb1NhdmUpIHtcbiAgICBjb25zdCBkYXRhU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgJyAgJylcbiAgICBjb25zdCBwcm9jZXNzZWRQYXRoID0gZW52VGVtcGxhdGVTdHJpbmcoZmlsZVBhdGgpXG4gICAgZnMud3JpdGVGaWxlU3luYyhwcm9jZXNzZWRQYXRoLCBkYXRhU3RyaW5nKVxuICB9XG59XG5cbmNvbnN0IGdldE15TWV0YSA9IChkYXRhKSA9PiBkYXRhLl9tZXRhICYmIGRhdGEuX21ldGFbRkpTT05fTUVUQV9EQVRBX0tFWV1cblxuY29uc3QgZW5zdXJlTXlNZXRhID0gKGRhdGEpID0+IHtcbiAgbGV0IG15TWV0YSA9IGdldE15TWV0YShkYXRhKVxuICBpZiAoIW15TWV0YSkge1xuICAgIGlmIChkYXRhLl9tZXRhID09PSB1bmRlZmluZWQpIHsgZGF0YS5fbWV0YSA9IHt9IH1cbiAgICBpZiAoZGF0YS5fbWV0YVtGSlNPTl9NRVRBX0RBVEFfS0VZXSA9PT0gdW5kZWZpbmVkKSB7IGRhdGEuX21ldGFbRkpTT05fTUVUQV9EQVRBX0tFWV0gPSB7fSB9XG4gICAgbXlNZXRhID0gZ2V0TXlNZXRhKGRhdGEpXG4gIH1cblxuICByZXR1cm4gbXlNZXRhXG59XG5cbi8qKlxuKiBVcGRhdGVzIChieSByZXR1cm5pbmcpIHRoZSBuZXcgZHluYW1pYyBwYXRoIGdpdmVuIHRoZSBjdXJyZW50IGRhdGEgcGF0aCAocmVsYXRpdmUgdG8gYSBkYXRhIG1vdW50IG9yIGxpbmsgcG9pbnQpIGFuZFxuKiBwcmV2aW91cyBkeW5hbWljIHBhdGguXG4qL1xuY29uc3QgdXBkYXRlanNvblBhdGhUb1NlbGYgPSAoanNvbk1vdW50UGF0aCwganNvblBhdGhUb1NlbGYpID0+IHtcbiAgaWYgKGpzb25Nb3VudFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBqc29uUGF0aFRvU2VsZiA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGpzb25Nb3VudFBhdGhcbiAgICAgIDogYCR7anNvblBhdGhUb1NlbGZ9JHtqc29uTW91bnRQYXRofWBcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cbn1cblxuLyoqXG4qIEludGVybmFsIGZ1bmN0aW9uIHRvIHRlc3QgZm9yIGFuZCBleHRyYWN0IG1vdW50IHNwZWNzIGZyb20gdGhlIHByb3ZpZGVkIEpTT04gb2JqZWN0LlxuKi9cbmNvbnN0IGdldE1vdW50U3BlY3MgPSAoZGF0YSkgPT4gZ2V0TXlNZXRhKGRhdGEpPy5tb3VudFNwZWNzXG5cbi8qKlxuKiBJbnRlcm5hbCBmdW5jdGlvbiB0byBwcm9jZXNzIGEgbW91bnQgc3BlYyBpbnRvIHVzZWZ1bCBjb21wb25lbnRzIHV0aWxpemVkIGJ5IHRoZSBgcmVhZEZKU09OYCBhbmQgYHdyaXRlRkpTT05gLlxuKi9cbmNvbnN0IHByb2Nlc3NNb3VudFNwZWMgPSAoeyBtbnRTcGVjLCBkYXRhLCBwcmVzZXJ2ZU9yaWdpbmFsIH0pID0+IHtcbiAgbGV0IHsgZGF0YVBhdGgsIGRhdGFGaWxlLCBkYXRhRGlyIH0gPSBtbnRTcGVjXG5cbiAgZGF0YUZpbGUgJiYgZGF0YURpciAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICYmIHRocm93IG5ldyBFcnJvcihgQmFkIG1vdW50IHNwZWM7IGNhbm5vdCBzcGVjaWZ5IGJvdGggZGF0YSBmaWxlICgke2RhdGFGaWxlfSkgYW5kIGRpcmVjdG9yeSAoJHtkYXRhRGlyfSlgKVxuICAhZGF0YUZpbGUgJiYgIWRhdGFEaXIgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAmJiB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBtb3VudCBzcGVjOyBuZWl0aGVyIGRhdGEgZmlsZSBub3IgZGlyZWN0b3J5LicpXG5cbiAgZGF0YUZpbGUgJiYgKGRhdGFGaWxlID0gZW52VGVtcGxhdGVTdHJpbmcoZGF0YUZpbGUpKVxuICBkYXRhRGlyICYmIChkYXRhRGlyID0gZW52VGVtcGxhdGVTdHJpbmcoZGF0YURpcikpXG5cbiAgY29uc3QgeyBwZW51bHRpbWF0ZVJlZjogbW91bnRQb2ludCwgZmluYWxLZXksIG5ld0RhdGEgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBkYXRhUGF0aCwgZGF0YSwgcHJlc2VydmVPcmlnaW5hbCB9KVxuXG4gIHJldHVybiB7IGRhdGFGaWxlLCBkYXRhRGlyLCBkYXRhUGF0aCwgbW91bnRQb2ludCwgZmluYWxLZXksIG5ld0RhdGEgfVxufVxuXG4vKipcbiogSW50ZXJuYWwgZnVuY3Rpb24gdG8gdGVzdCBmb3IgYW5kIGV4dHJhY3QgbGluayBzcGVjcyBmcm9tIHRoZSBwcm92aWRlZCBKU09OIG9iamVjdC5cbiovXG5jb25zdCBnZXRMaW5rU3BlY3MgPSAoZGF0YSkgPT4gZ2V0TXlNZXRhKGRhdGEpPy5saW5rU3BlY3NcblxuLyoqXG4qIEludGVybmFsIGZ1bmN0aW9uIHRvIHByb2Nlc3MgYSBsaW5rIHNwZWMgaW50byB1c2VmdWwgY29tcG9uZW50cyB1dGlsaXplZCBieSB0aGUgYHJlYWRGSlNPTmAgYW5kIGB3cml0ZUZKU09OYC5cbiovXG5jb25zdCBwcm9jZXNzTGlua1NwZWMgPSAobG5rU3BlYywgZGF0YSkgPT4ge1xuICBjb25zdCB7IGxpbmtSZWZzLCBsaW5rVG8sIGxpbmtLZXk6IGtleU5hbWUgfSA9IGxua1NwZWNcblxuICBjb25zdCB7IGZpbmFsUmVmLCBwZW51bHRpbWF0ZVJlZiwgZmluYWxLZXkgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBsaW5rUmVmcywgZGF0YSB9KVxuICBjb25zdCB7IGZpbmFsUmVmOiBzb3VyY2UgfSA9IHByb2Nlc3NKU09OUGF0aCh7IHBhdGggOiBsaW5rVG8sIGRhdGEgfSlcblxuICByZXR1cm4geyBmaW5hbFJlZiwgc291cmNlLCBrZXlOYW1lLCBwZW51bHRpbWF0ZVJlZiwgZmluYWxLZXkgfVxufVxuXG5jb25zdCBzaGFsbG93Q29weSA9IChpbnB1dCkgPT4gQXJyYXkuaXNBcnJheShpbnB1dClcbiAgPyBpbnB1dC5zbGljZSgpXG4gIDogdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JyAmJiBpbnB1dCAhPT0gbnVsbFxuICAgID8gT2JqZWN0LmFzc2lnbih7fSwgaW5wdXQpXG4gICAgOiBpbnB1dFxuXG5jb25zdCBwcm9jZXNzSlNPTlBhdGggPSAoeyBwYXRoLCBkYXRhLCBwcmVzZXJ2ZU9yaWdpbmFsIH0pID0+IHtcbiAgaWYgKCFwYXRoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gJ2RhdGFQYXRoJyBzcGVjaWZpZWQgZm9yIG1vdW50IHNwZWMgbW91bnQgcG9pbnQuXCIpXG4gIH1cbiAgY29uc3QgcGF0aFRyYWlsID0gcGF0aC5zcGxpdCgnLicpXG4gIHBhdGhUcmFpbC5zaGlmdCgpXG4gIGNvbnN0IGZpbmFsS2V5ID0gcGF0aFRyYWlsLnBvcCgpXG4gIGNvbnN0IG5ld0RhdGEgPSBwcmVzZXJ2ZU9yaWdpbmFsID8gc2hhbGxvd0NvcHkoZGF0YSkgOiBkYXRhXG5cbiAgbGV0IHBlbnVsdGltYXRlUmVmID0gbmV3RGF0YSAvLyBub3QgbmVjZXNzYXJpbHkgcGVudWx0aW1hdGUgeWV0LCBidXQgd2lsbCBiZS4uLlxuICBmb3IgKGNvbnN0IGtleSBvZiBwYXRoVHJhaWwpIHtcbiAgICBpZiAocHJlc2VydmVPcmlnaW5hbCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gc2hhbGxvd0NvcHkocGVudWx0aW1hdGVSZWZba2V5XSlcbiAgICAgIHBlbnVsdGltYXRlUmVmW2tleV0gPSByZXN1bHRcbiAgICAgIHBlbnVsdGltYXRlUmVmID0gcmVzdWx0XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcGVudWx0aW1hdGVSZWYgPSBwZW51bHRpbWF0ZVJlZltrZXldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmaW5hbFJlZiA6IHBlbnVsdGltYXRlUmVmW2ZpbmFsS2V5XSxcbiAgICBwZW51bHRpbWF0ZVJlZixcbiAgICBmaW5hbEtleSxcbiAgICBuZXdEYXRhXG4gIH1cbn1cblxuLy8gYWxpYXNlcyBmb3IgJ2ltcG9ydCAqIGFzIGZqc29uOyBmanNvbi53cml0ZSgpJyBzdHlsZVxuY29uc3Qgd3JpdGUgPSB3cml0ZUZKU09OXG5jb25zdCByZWFkID0gcmVhZEZKU09OXG5cbmV4cG9ydCB7XG4gIGFkZE1vdW50UG9pbnQsIHJlYWRGSlNPTiwgc2V0U291cmNlLCB3cml0ZUZKU09OLCAvLyBzdGFuZGFyZCBpbnRlcmZhY2VcbiAgRkpTT05fTUVUQV9EQVRBX0tFWSwgLy8gcG9zc2libHkgdXNlZnVsPyBtYXkgYmUgcmVtb3ZlZCBiZWZvcmUgJzEuMCdcbiAgd3JpdGUsIHJlYWQgLy8gYWxpYXNlc1xufVxuIl0sIm5hbWVzIjpbInJlcGxhY2VSRSIsImVudlRlbXBsYXRlU3RyaW5nIiwicGF0aCIsIm9yaWdQYXRoIiwibWF0Y2hlcyIsIm1hdGNoQWxsIiwibGVuZ3RoIiwicmV2ZXJzZSIsIm1hdGNoSW5mbyIsIm1hdGNoIiwia2V5IiwidmFsdWUiLCJwcm9jZXNzIiwiZW52IiwibWF0Y2hTdGFydCIsImluZGV4IiwidW5kZWZpbmVkIiwiRXJyb3IiLCJzdWJzdHJpbmciLCJ0ZXN0SnNvblBhdGhzIiwicGF0aEEiLCJwYXRoQiIsIlN0cmluZyIsInBhdGhBQml0cyIsInNwbGl0IiwicGF0aEJCaXRzIiwic2hpZnQiLCJhQml0IiwiYkJpdCIsIkZKU09OX01FVEFfREFUQV9LRVkiLCJhZGRNb3VudFBvaW50IiwiZGF0YSIsImRhdGFQYXRoIiwiZGF0YUZpbGUiLCJtb3VudFNwZWNzIiwiZ2V0TW91bnRTcGVjcyIsIm15TWV0YSIsImVuc3VyZU15TWV0YSIsImkiLCJmaW5kSW5kZXgiLCJlbCIsIm1vdW50U3BlYyIsInB1c2giLCJqc29uUkUiLCJyZWFkRkpTT04iLCJmaWxlUGF0aCIsIm9wdGlvbnMiLCJyZW1lbWJlclNvdXJjZSIsInByb2Nlc3NlZFBhdGgiLCJmcyIsIm1zZyIsImRhdGFCaXRzIiwiSlNPTiIsInBhcnNlIiwiZSIsIlN5bnRheEVycm9yIiwibWVzc2FnZSIsInNldFNvdXJjZSIsIm1udFNwZWMiLCJwcm9jZXNzTW91bnRTcGVjIiwiZGF0YURpciIsIm1vdW50UG9pbnQiLCJmaW5hbEtleSIsInN1YkRhdGEiLCJtbnRPYmoiLCJmaWxlcyIsIndpdGhGaWxlVHlwZXMiLCJmaWx0ZXIiLCJpdGVtIiwiaXNEaXJlY3RvcnkiLCJ0ZXN0IiwibmFtZSIsIm1hcCIsImRpckZpbGUiLCJtbnRQbnQiLCJyZXBsYWNlIiwiZ2V0TGlua1NwZWNzIiwibG5rU3BlYyIsInByb2Nlc3NMaW5rU3BlYyIsImZpbmFsUmVmIiwic291cmNlIiwia2V5TmFtZSIsInBlbnVsdGltYXRlUmVmIiwiZ2V0UmVhbEl0ZW0iLCJzb3VyZSIsImZpbmQiLCJjYW5kaWRhdGUiLCJsaW5rVG8iLCJBcnJheSIsImlzQXJyYXkiLCJyZWFsSXRlbXMiLCJzcGxpY2UiLCJPYmplY3QiLCJrZXlzIiwic291cmNlRmlsZSIsIndyaXRlRkpTT04iLCJzYXZlRnJvbSIsImpzb25QYXRoVG9TZWxmIiwiZ2V0TXlNZXRhIiwiZG9TYXZlIiwicHJlc2VydmVPcmlnaW5hbCIsIm5ld0RhdGEiLCJ1cGRhdGVqc29uUGF0aFRvU2VsZiIsInN1YktleSIsImRhdGFTdHJpbmciLCJzdHJpbmdpZnkiLCJfbWV0YSIsImpzb25Nb3VudFBhdGgiLCJwcm9jZXNzSlNPTlBhdGgiLCJsaW5rU3BlY3MiLCJsaW5rUmVmcyIsImxpbmtLZXkiLCJzaGFsbG93Q29weSIsImlucHV0Iiwic2xpY2UiLCJhc3NpZ24iLCJwYXRoVHJhaWwiLCJwb3AiLCJyZXN1bHQiLCJ3cml0ZSIsInJlYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUN0QixFQUFFLHlCQUF5QixDQUFDO0FBQzVCO0FBQ0EsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO0FBQzNFLElBQUksY0FBYyxHQUFHLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDckQsTUFBTSxPQUFPLE9BQU8sR0FBRyxDQUFDO0FBQ3hCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ2pGLEdBQUcsTUFBTTtBQUNULElBQUksY0FBYyxHQUFHLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksR0FBRyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLE9BQU8sR0FBRyxDQUFDO0FBQ25JLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxNQUFNLENB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
