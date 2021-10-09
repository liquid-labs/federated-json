import * as fs from 'fs';
import * as path from 'path';

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

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

    var _iterator = _createForOfIteratorHelper$1(matches),
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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var FJSON_META_DATA_KEY = 'com.liquid-labs.federated-json';
/**
* Adds or updates a mount point entry. WARNING: This method does not currently support sub-mounts. These must be
* manually updated by accessing the sub-data structure and modifying it's mount points directly.
*/

var addMountPoint = function addMountPoint(data, path, file) {
  var mountSpecs = getMountSpecs(data);

  if (mountSpecs === undefined) {
    mountSpecs = [];
    var myMeta = ensureMyMeta(data);

    if (myMeta.mountSpecs === undefined) {
      myMeta.mountSpecs = mountSpecs;
    }
  }

  var i = mountSpecs.findIndex(function (el) {
    return el.path === path;
  });
  var mountSpec = {
    path: path,
    file: file
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

  var _iterator = _createForOfIteratorHelper(getMountSpecs(data) || []),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mntSpec = _step.value;

      var _processMountSpec = processMountSpec({
        mntSpec: mntSpec,
        data: data
      }),
          file = _processMountSpec.file,
          dir = _processMountSpec.dir,
          mountPoint = _processMountSpec.mountPoint,
          finalKey = _processMountSpec.finalKey;

      if (file) {
        var subData = readFJSON(file);
        mountPoint[finalKey] = subData;
      } else {
        // 'dir' is good because we expect processMountSpec() to raise an exception if neither specified.
        var mntObj = {};
        mountPoint[finalKey] = mntObj;
        var files = fs.readdirSync(dir, {
          withFileTypes: true
        }).filter(function (item) {
          return !item.isDirectory() && jsonRE.test(item.name);
        }).map(function (item) {
          return item.name;
        }); // note 'name' is the simple/basename, not the whole path.

        var _iterator3 = _createForOfIteratorHelper(files),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var dirFile = _step3.value;
            var mntPnt = dirFile.replace(jsonRE, '');

            var _subData = readFJSON(path.join(dir, dirFile));

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

  var _iterator2 = _createForOfIteratorHelper(getLinkSpecs(data) || []),
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
      throw new Error('File was not provided and no \'meta.sourceFile\' defined (or invalid).');
    }
  }

  var doSave = saveFrom === undefined || jsonPathToSelf && testJsonPaths(saveFrom, jsonPathToSelf);

  if (doSave && !filePath) {
    throw new Error('No explicit filePath provided and no source found in object meta data.');
  }

  var mountSpecs = getMountSpecs(data);

  if (mountSpecs) {
    var _iterator4 = _createForOfIteratorHelper(mountSpecs),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var mntSpec = _step4.value;

        var _processMountSpec2 = processMountSpec({
          mntSpec: mntSpec,
          data: data,
          preserveOriginal: true
        }),
            file = _processMountSpec2.file,
            dir = _processMountSpec2.dir,
            path = _processMountSpec2.path,
            mountPoint = _processMountSpec2.mountPoint,
            finalKey = _processMountSpec2.finalKey,
            newData = _processMountSpec2.newData;

        data = newData;
        var subData = mountPoint[finalKey];
        mountPoint[finalKey] = null; // What's our save scheme? Single data file, or a scan dir?

        if (file) {
          writeFJSON({
            data: subData,
            filePath: file,
            saveFrom: saveFrom,
            jsonPathToSelf: updatejsonPathToSelf(path, jsonPathToSelf)
          });
        } else {
          // processMountSpec will raise an exception if neither file nor dir is defined.
          // We don't bother to test what 'dir' is. If it exists, we won't overwrite, so the subsequent attempt to
          // write a file into it can just fail if it's not of an appropriate type.
          fs.existsSync(dir) || fs.mkdirSync(dir);

          for (var _i2 = 0, _Object$keys2 = Object.keys(subData); _i2 < _Object$keys2.length; _i2++) {
            var subKey = _Object$keys2[_i2];
            writeFJSON({
              data: subData[subKey],
              filePath: path.join(dir, "".concat(subKey, ".json")),
              saveFrom: saveFrom,
              jsonPathToSelf: updatejsonPathToSelf("".concat(path, ".").concat(subKey), jsonPathToSelf)
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
  var path = mntSpec.path,
      file = mntSpec.file,
      dir = mntSpec.dir;
  file && dir // eslint-disable-line no-unused-expressions
  && function (e) {
    throw e;
  }(new Error("Bad mount spec; cannot specify both data file (".concat(file, ") and directory (").concat(dir, ")")));
  !file && !dir // eslint-disable-line no-unused-expressions
  && function (e) {
    throw e;
  }(new Error('Bad mount spec; neither data file nor directory.'));
  file && (file = envTemplateString(file));
  dir && (dir = envTemplateString(dir));

  var _processJSONPath = processJSONPath({
    path: path,
    data: data,
    preserveOriginal: preserveOriginal
  }),
      mountPoint = _processJSONPath.penultimateRef,
      finalKey = _processJSONPath.finalKey,
      newData = _processJSONPath.newData;

  return {
    file: file,
    dir: dir,
    path: path,
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
    throw new Error("No 'path' specified for mount spec mount point.");
  }

  var pathTrail = path.split('.');
  pathTrail.shift();
  var finalKey = pathTrail.pop();
  var newData = preserveOriginal ? shallowCopy(data) : data;
  var penultimateRef = newData; // not necessarily penultimate yet, but will be...

  var _iterator5 = _createForOfIteratorHelper(pathTrail),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhvdXRIb2xlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVTcHJlYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90b0NvbnN1bWFibGVBcnJheS5qcyIsIi4uL3NyYy9saWIvdXRpbHMuanMiLCIuLi9zcmMvbGliL2ZlZGVyYXRlZC1qc29uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcblxuICAgIG1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3R5cGVvZjtcbm1vZHVsZS5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1vZHVsZS5leHBvcnRzLCBtb2R1bGUuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5TGlrZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5LmpzXCIpO1xuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aG91dEhvbGVzO1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVTcHJlYWQ7XG5tb2R1bGUuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBtb2R1bGUuZXhwb3J0cywgbW9kdWxlLmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyIGFycmF5V2l0aG91dEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRob3V0SG9sZXMuanNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXkuanNcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzXCIpO1xuXG52YXIgbm9uSXRlcmFibGVTcHJlYWQgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVNwcmVhZC5qc1wiKTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IG5vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3RvQ29uc3VtYWJsZUFycmF5O1xubW9kdWxlLmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbW9kdWxlLmV4cG9ydHMsIG1vZHVsZS5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIi8qKlxuKiBQYWNrYWdlIGludGVybmFsIHV0aWxpdHkgZnVuY3Rpb25zLlxuKi9cbmNvbnN0IHJlcGxhY2VSRSA9IC9cXCRcXHsoW0EtWmEtel9dW0EtWmEtejAtOV9dKilcXH0vZ1xuXG4vKipcbiogUmVwbGFjZXMgY29uc3RydWN0cyBsaWtlICcke0ZPT30nIHdpdGggdGhlIGVudmlyb25tZW50IHZhbHVlIG9mICdGT08nIChvciB3aGF0ZXZlciBrZXkgaXMgdXNlZCkuIFdpbGwgcmFpc2UgYW5cbiogZXhjZXB0aW9uIGlmIG5vIHZhbHVlIGlzIGZvdW5kIGZvciBhIGdpdmVuIGtleS5cbiovXG5jb25zdCBlbnZUZW1wbGF0ZVN0cmluZyA9IChwYXRoKSA9PiB7XG4gIGNvbnN0IG9yaWdQYXRoID0gcGF0aCAvLyB1c2VkIGZvciBlcnJvciBtZXNzYWdlc1xuXG4gIGxldCBtYXRjaGVzIC8vIEEgcmVwbGFjZWQgdmFyIG1heSBpdHNlbGYgcmVmZXJlbmNlIHZhcnMsIHNvIHdlIGtlZXAgcHJvY2Vzc2luZyB1bnRpbCBldmVyeXRoaW5nIGlzIHJlc29sdmVkLlxuICB3aGlsZSAoKG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXSkubGVuZ3RoID4gMCkge1xuICAgIC8vIGNvbnN0IG1hdGNoZXMgPSBbLi4ucGF0aC5tYXRjaEFsbChyZXBsYWNlUkUpXVxuICAgIG1hdGNoZXMucmV2ZXJzZSgpIC8vIFRoZSByZXZlcnNlIGFsbG93cyB1cyB0byB1c2UgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kZXhlcyB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIHN0cmluZy5cbiAgICBmb3IgKGNvbnN0IG1hdGNoSW5mbyBvZiBtYXRjaGVzKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IG1hdGNoSW5mb1swXVxuICAgICAgY29uc3Qga2V5ID0gbWF0Y2hJbmZvWzFdXG4gICAgICBjb25zdCB2YWx1ZSA9IHByb2Nlc3MuZW52W2tleV1cbiAgICAgIGNvbnN0IG1hdGNoU3RhcnQgPSBtYXRjaEluZm8uaW5kZXhcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc3VjaCBlbnZpcm9ubWVudCBwYXJhbWV0ZXIgJyR7a2V5fScgZm91bmQgaW4gcGF0aCByZXBsYWNlbWVudDogJyR7b3JpZ1BhdGh9Jy5gKVxuICAgICAgfVxuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIG1hdGNoU3RhcnQpICsgdmFsdWUgKyBwYXRoLnN1YnN0cmluZyhtYXRjaFN0YXJ0ICsgbWF0Y2gubGVuZ3RoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuKiBSZXR1cm5zIHRydWUgaWYgcGF0aEEgaXMgb24gcGF0aEIuIEkuZS4sIGlmIHBhdGhCIGlzIG9yIHVuZGVyIHBhdGhBLiBFLmcuOlxuKiAtICgnLicsICcuZm9vJykgPT4gdHJ1ZVxuKiAtICgnLmZvbycsICcuJykgPT4gZmFsc2VcbiogLSAoJy5mb28nLCAnLmZvbycpID0+IHRydWVcbipcbiogTm90ZSwgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoZSBwYXRocyBhcmUgdmFsaWQgSlNPTiBwYXRocy5cbiovXG5jb25zdCB0ZXN0SnNvblBhdGhzID0gKHBhdGhBLCBwYXRoQikgPT4ge1xuICBpZiAoKHR5cGVvZiBwYXRoQSAhPT0gJ3N0cmluZycgJiYgIShwYXRoQSBpbnN0YW5jZW9mIFN0cmluZykpXG4gICAgICB8fCAodHlwZW9mIHBhdGhCICE9PSAnc3RyaW5nJyAmJiAhKHBhdGhCIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbm9uLXN0cmluZyBpbnB1dDogJyR7cGF0aEF9JywgJyR7cGF0aEJ9J2ApXG4gIH1cbiAgY29uc3QgcGF0aEFCaXRzID0gcGF0aEEuc3BsaXQoJy4nKVxuICBjb25zdCBwYXRoQkJpdHMgPSBwYXRoQi5zcGxpdCgnLicpXG4gIGlmIChwYXRoQUJpdHMubGVuZ3RoID4gcGF0aEJCaXRzLmxlbmd0aCkgeyByZXR1cm4gZmFsc2UgfVxuXG4gIHdoaWxlIChwYXRoQUJpdHNbMF0gPT09ICcnKSB7IHBhdGhBQml0cy5zaGlmdCgpIH1cbiAgd2hpbGUgKHBhdGhCQml0c1swXSA9PT0gJycpIHsgcGF0aEJCaXRzLnNoaWZ0KCkgfVxuICBpZiAocGF0aEFCaXRzLmxlbmd0aCA+IHBhdGhCQml0cy5sZW5ndGgpIHsgcmV0dXJuIGZhbHNlIH1cblxuICB3aGlsZSAocGF0aEFCaXRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBhQml0ID0gcGF0aEFCaXRzLnNoaWZ0KClcbiAgICBjb25zdCBiQml0ID0gcGF0aEJCaXRzLnNoaWZ0KClcblxuICAgIGlmIChiQml0ICE9PSBhQml0KSB7IHJldHVybiBmYWxzZSB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgeyBlbnZUZW1wbGF0ZVN0cmluZywgdGVzdEpzb25QYXRocyB9XG4iLCIvKipcbiogTGlicmFyeSB0aGF0IGJ1aWxkcyBhIHNpbmdsZSBKU09OIG9iamVjdCBmcm9tIG11bHRpcGxlIEpTT04gZmlsZXMuIEFzIGVhY2ggZmlsZSBpcyBsb2FkZWQsIHdlIGNoZWNrXG4qIGBfbWV0YS9jb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWRhdGEvbW91bnRTcGVjc2AuIEVhY2ggc3BlYyBjb25zaXN0cyBvZiBhIGBkYXRhUGF0aGAgYW5kIGBkYXRhRmlsZWAgZWxlbWVudC4gVGhlXG4qIGRhdGEgcGF0aCBpcyBzcGxpdCBvbiAnLycgYW5kIGVhY2ggZWxlbWVudCBpcyB0cmVhdGVkIGFzIGEgc3RyaW5nLiBUaGVyZWZvcmUsIHRoZSBwYXRoIGlzIGNvbXBhdGlibGUgd2l0aCBvYmplY3Qga2V5c1xuKiBidXQgZG9lcyBub3Qgc3VwcG9ydCBhcnJheXMuXG4qL1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5cbmltcG9ydCB7IGVudlRlbXBsYXRlU3RyaW5nLCB0ZXN0SnNvblBhdGhzIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgRkpTT05fTUVUQV9EQVRBX0tFWSA9ICdjb20ubGlxdWlkLWxhYnMuZmVkZXJhdGVkLWpzb24nXG5cbi8qKlxuKiBBZGRzIG9yIHVwZGF0ZXMgYSBtb3VudCBwb2ludCBlbnRyeS4gV0FSTklORzogVGhpcyBtZXRob2QgZG9lcyBub3QgY3VycmVudGx5IHN1cHBvcnQgc3ViLW1vdW50cy4gVGhlc2UgbXVzdCBiZVxuKiBtYW51YWxseSB1cGRhdGVkIGJ5IGFjY2Vzc2luZyB0aGUgc3ViLWRhdGEgc3RydWN0dXJlIGFuZCBtb2RpZnlpbmcgaXQncyBtb3VudCBwb2ludHMgZGlyZWN0bHkuXG4qL1xuY29uc3QgYWRkTW91bnRQb2ludCA9IChkYXRhLCBkYXRhUGF0aCwgZGF0YUZpbGUpID0+IHtcbiAgbGV0IG1vdW50U3BlY3MgPSBnZXRNb3VudFNwZWNzKGRhdGEpXG5cbiAgaWYgKG1vdW50U3BlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG1vdW50U3BlY3MgPSBbXVxuICAgIGNvbnN0IG15TWV0YSA9IGVuc3VyZU15TWV0YShkYXRhKVxuICAgIGlmIChteU1ldGEubW91bnRTcGVjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBteU1ldGEubW91bnRTcGVjcyA9IG1vdW50U3BlY3NcbiAgICB9XG4gIH1cblxuICBjb25zdCBpID0gbW91bnRTcGVjcy5maW5kSW5kZXgoKGVsKSA9PiBlbC5kYXRhUGF0aCA9PT0gZGF0YVBhdGgpXG4gIGNvbnN0IG1vdW50U3BlYyA9IHsgZGF0YVBhdGggOiBkYXRhUGF0aCwgZGF0YUZpbGUgfVxuICBpZiAoaSAhPT0gLTEpIHtcbiAgICBtb3VudFNwZWNzW2ldID0gbW91bnRTcGVjXG4gIH1cbiAgZWxzZSB7XG4gICAgbW91bnRTcGVjcy5wdXNoKG1vdW50U3BlYylcbiAgfVxufVxuXG5jb25zdCBqc29uUkUgPSAvXFwuanNvbiQvXG5cbi8qKlxuKiBSZWFkcyBhIEpTT04gZmlsZSBhbmQgcHJvY2Vzc2VzIGZvciBmZWRlcmF0ZWQgbW91bnQgcG9pbnRzIHRvIGNvbnN0cnVjdCBhIGNvbXBvc2l0ZSBKU09OIG9iamVjdCBmcm9tIG9uZSBvciBtb3JlXG4qIGZpbGVzLlxuKi9cbmNvbnN0IHJlYWRGSlNPTiA9IChmaWxlUGF0aCwgb3B0aW9ucykgPT4ge1xuICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcihgRmlsZSBwYXRoIGludmFsaWQuICgke2ZpbGVQYXRofSlgKSB9XG5cbiAgY29uc3QgeyByZW1lbWJlclNvdXJjZSB9ID0gb3B0aW9ucyB8fCB7fVxuXG4gIGNvbnN0IHByb2Nlc3NlZFBhdGggPSBlbnZUZW1wbGF0ZVN0cmluZyhmaWxlUGF0aClcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHByb2Nlc3NlZFBhdGgpKSB7XG4gICAgY29uc3QgbXNnID0gYE5vIHN1Y2ggZmlsZTogJyR7ZmlsZVBhdGh9J2AgKyAoZmlsZVBhdGggIT09IHByb2Nlc3NlZFBhdGggPyBgICgnJHtwcm9jZXNzZWRQYXRofScpYCA6ICcnKVxuICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gIH1cbiAgY29uc3QgZGF0YUJpdHMgPSBmcy5yZWFkRmlsZVN5bmMocHJvY2Vzc2VkUGF0aClcbiAgbGV0IGRhdGEgLy8gYWN0dWFsbHksIHdvdWxkIGxvdmUgJ2NvbnN0JywgYnV0IG5lZWQgdG8gc2V0IGluc2lkZSB0cnkgYmxvY2sgYW5kIGRvbid3IHdhbnQgdG8gZXhwYW5kIHNjb3BlIG9mIHRoZSB0cnkuXG4gIHRyeSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YUJpdHMpXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYCR7ZS5tZXNzYWdlfSB3aGlsZSBwcm9jZXNzaW5nICR7ZmlsZVBhdGh9YClcbiAgICB9XG4gIH1cblxuICBpZiAocmVtZW1iZXJTb3VyY2UpIHtcbiAgICBzZXRTb3VyY2UoZGF0YSwgZmlsZVBhdGgpXG4gIH1cblxuICBmb3IgKGNvbnN0IG1udFNwZWMgb2YgZ2V0TW91bnRTcGVjcyhkYXRhKSB8fCBbXSkge1xuICAgIGNvbnN0IHsgZGF0YUZpbGUsIGRhdGFEaXIsIG1vdW50UG9pbnQsIGZpbmFsS2V5IH0gPSBwcm9jZXNzTW91bnRTcGVjKHsgbW50U3BlYywgZGF0YSB9KVxuICAgIGlmIChkYXRhRmlsZSkge1xuICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihkYXRhRmlsZSlcblxuICAgICAgbW91bnRQb2ludFtmaW5hbEtleV0gPSBzdWJEYXRhXG4gICAgfVxuICAgIGVsc2UgeyAvLyAnZGF0YURpcicgaXMgZ29vZCBiZWNhdXNlIHdlIGV4cGVjdCBwcm9jZXNzTW91bnRTcGVjKCkgdG8gcmFpc2UgYW4gZXhjZXB0aW9uIGlmIG5laXRoZXIgc3BlY2lmaWVkLlxuICAgICAgY29uc3QgbW50T2JqID0ge31cbiAgICAgIG1vdW50UG9pbnRbZmluYWxLZXldID0gbW50T2JqXG5cbiAgICAgIGNvbnN0IGZpbGVzID0gZnMucmVhZGRpclN5bmMoZGF0YURpciwgeyB3aXRoRmlsZVR5cGVzIDogdHJ1ZSB9KVxuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uaXNEaXJlY3RvcnkoKSAmJiBqc29uUkUudGVzdChpdGVtLm5hbWUpKVxuICAgICAgICAubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKSAvLyBub3RlICduYW1lJyBpcyB0aGUgc2ltcGxlL2Jhc2VuYW1lLCBub3QgdGhlIHdob2xlIHBhdGguXG5cbiAgICAgIGZvciAoY29uc3QgZGlyRmlsZSBvZiBmaWxlcykge1xuICAgICAgICBjb25zdCBtbnRQbnQgPSBkaXJGaWxlLnJlcGxhY2UoanNvblJFLCAnJylcbiAgICAgICAgY29uc3Qgc3ViRGF0YSA9IHJlYWRGSlNPTihwYXRoLmpvaW4oZGF0YURpciwgZGlyRmlsZSkpXG4gICAgICAgIG1udE9ialttbnRQbnRdID0gc3ViRGF0YVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgbG5rU3BlYyBvZiBnZXRMaW5rU3BlY3MoZGF0YSkgfHwgW10pIHtcbiAgICBjb25zdCB7IGZpbmFsUmVmLCBzb3VyY2UsIGtleU5hbWUsIHBlbnVsdGltYXRlUmVmLCBmaW5hbEtleSB9ID0gcHJvY2Vzc0xpbmtTcGVjKGxua1NwZWMsIGRhdGEpXG5cbiAgICBjb25zdCBnZXRSZWFsSXRlbSA9IChzb3VyZSwga2V5TmFtZSwga2V5KSA9PlxuICAgICAgc291cmNlLmZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlW2tleU5hbWVdID09PSBrZXkpXG4gICAgICAgIHx8IHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgbGluayAnJHtrZXl9JyBpbiAnJHtsbmtTcGVjLmxpbmtUb30nLmApXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShmaW5hbFJlZikpIHsgLy8gcmVwbGFjZSB0aGUgY29udGVudHNcbiAgICAgIGNvbnN0IHJlYWxJdGVtcyA9IGZpbmFsUmVmLm1hcCgoa2V5KSA9PiBnZXRSZWFsSXRlbShzb3VyY2UsIGtleU5hbWUsIGtleSkpXG4gICAgICBmaW5hbFJlZi5zcGxpY2UoMCwgZmluYWxSZWYubGVuZ3RoLCAuLi5yZWFsSXRlbXMpXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBmaW5hbFJlZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGZpbmFsUmVmKSkge1xuICAgICAgICBmaW5hbFJlZltrZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBrZXkpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgeyAvLyBpdCdzIGEgc2luZ2xlIGtleVxuICAgICAgcGVudWx0aW1hdGVSZWZbZmluYWxLZXldID0gZ2V0UmVhbEl0ZW0oc291cmNlLCBrZXlOYW1lLCBmaW5hbFJlZilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YVxufVxuXG4vKipcbiogU2V0J3MgdGhlIG1ldGEgc291cmNlIGluZm9ybWF0aW9uLlxuKi9cbmNvbnN0IHNldFNvdXJjZSA9IChkYXRhLCBmaWxlUGF0aCkgPT4ge1xuICBjb25zdCBteU1ldGEgPSBlbnN1cmVNeU1ldGEoZGF0YSlcbiAgbXlNZXRhLnNvdXJjZUZpbGUgPSBmaWxlUGF0aFxufVxuXG4vKipcbiogV3JpdGVzIGEgc3RhbmRhcmQgb3IgZmVkZXJhdGVkIEpTT04gZmlsZSBieSBhbmFseXNpbmcgdGhlIG9iamVjdHMgbWV0YSBkYXRhIGFuZCBicmVha2luZyB0aGUgc2F2ZWQgZmlsZXMgdXBcbiogYWNjb3VyZGluZyB0byB0aGUgY29uZmlndXJhdGlvbi5cbiovXG5jb25zdCB3cml0ZUZKU09OID0gKHsgZGF0YSwgZmlsZVBhdGgsIHNhdmVGcm9tLCBqc29uUGF0aFRvU2VsZiB9KSA9PiB7XG4gIGlmIChmaWxlUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbXlNZXRhID0gZ2V0TXlNZXRhKGRhdGEpXG4gICAgZmlsZVBhdGggPSBteU1ldGEgJiYgbXlNZXRhLnNvdXJjZUZpbGVcbiAgICBpZiAoIWZpbGVQYXRoKSB7IHRocm93IG5ldyBFcnJvcignRmlsZSB3YXMgbm90IHByb3ZpZGVkIGFuZCBubyBcXCdtZXRhLnNvdXJjZUZpbGVcXCcgZGVmaW5lZCAob3IgaW52YWxpZCkuJykgfVxuICB9XG5cbiAgY29uc3QgZG9TYXZlID0gc2F2ZUZyb20gPT09IHVuZGVmaW5lZCB8fCAoanNvblBhdGhUb1NlbGYgJiYgdGVzdEpzb25QYXRocyhzYXZlRnJvbSwganNvblBhdGhUb1NlbGYpKVxuICBpZiAoZG9TYXZlICYmICFmaWxlUGF0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gZXhwbGljaXQgZmlsZVBhdGggcHJvdmlkZWQgYW5kIG5vIHNvdXJjZSBmb3VuZCBpbiBvYmplY3QgbWV0YSBkYXRhLicpXG4gIH1cblxuICBjb25zdCBtb3VudFNwZWNzID0gZ2V0TW91bnRTcGVjcyhkYXRhKVxuICBpZiAobW91bnRTcGVjcykge1xuICAgIGZvciAoY29uc3QgbW50U3BlYyBvZiBtb3VudFNwZWNzKSB7XG4gICAgICBjb25zdCB7IGRhdGFGaWxlLCBkYXRhRGlyLCBkYXRhUGF0aCwgbW91bnRQb2ludCwgZmluYWxLZXksIG5ld0RhdGEgfSA9XG4gICAgICAgIHByb2Nlc3NNb3VudFNwZWMoeyBtbnRTcGVjLCBkYXRhLCBwcmVzZXJ2ZU9yaWdpbmFsIDogdHJ1ZSB9KVxuICAgICAgZGF0YSA9IG5ld0RhdGFcblxuICAgICAgY29uc3Qgc3ViRGF0YSA9IG1vdW50UG9pbnRbZmluYWxLZXldXG4gICAgICBtb3VudFBvaW50W2ZpbmFsS2V5XSA9IG51bGxcbiAgICAgIC8vIFdoYXQncyBvdXIgc2F2ZSBzY2hlbWU/IFNpbmdsZSBkYXRhIGZpbGUsIG9yIGEgc2NhbiBkaXI/XG4gICAgICBpZiAoZGF0YUZpbGUpIHtcbiAgICAgICAgd3JpdGVGSlNPTih7XG4gICAgICAgICAgZGF0YSAgICAgICAgICAgOiBzdWJEYXRhLFxuICAgICAgICAgIGZpbGVQYXRoICAgICAgIDogZGF0YUZpbGUsXG4gICAgICAgICAgc2F2ZUZyb20sXG4gICAgICAgICAganNvblBhdGhUb1NlbGYgOiB1cGRhdGVqc29uUGF0aFRvU2VsZihkYXRhUGF0aCwganNvblBhdGhUb1NlbGYpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8gcHJvY2Vzc01vdW50U3BlYyB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbiBpZiBuZWl0aGVyIGRhdGFGaWxlIG5vciBkYXRhRGlyIGlzIGRlZmluZWQuXG4gICAgICAgIC8vIFdlIGRvbid0IGJvdGhlciB0byB0ZXN0IHdoYXQgJ2RhdGFEaXInIGlzLiBJZiBpdCBleGlzdHMsIHdlIHdvbid0IG92ZXJ3cml0ZSwgc28gdGhlIHN1YnNlcXVlbnQgYXR0ZW1wdCB0b1xuICAgICAgICAvLyB3cml0ZSBhIGZpbGUgaW50byBpdCBjYW4ganVzdCBmYWlsIGlmIGl0J3Mgbm90IG9mIGFuIGFwcHJvcHJpYXRlIHR5cGUuXG4gICAgICAgIGZzLmV4aXN0c1N5bmMoZGF0YURpcikgfHwgZnMubWtkaXJTeW5jKGRhdGFEaXIpXG5cbiAgICAgICAgZm9yIChjb25zdCBzdWJLZXkgb2YgT2JqZWN0LmtleXMoc3ViRGF0YSkpIHtcbiAgICAgICAgICB3cml0ZUZKU09OKHtcbiAgICAgICAgICAgIGRhdGEgICAgICAgICAgIDogc3ViRGF0YVtzdWJLZXldLFxuICAgICAgICAgICAgZmlsZVBhdGggICAgICAgOiBwYXRoLmpvaW4oZGF0YURpciwgYCR7c3ViS2V5fS5qc29uYCksXG4gICAgICAgICAgICBzYXZlRnJvbSxcbiAgICAgICAgICAgIGpzb25QYXRoVG9TZWxmIDogdXBkYXRlanNvblBhdGhUb1NlbGYoYCR7ZGF0YVBhdGh9LiR7c3ViS2V5fWAsIGpzb25QYXRoVG9TZWxmKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZG9TYXZlKSB7XG4gICAgY29uc3QgZGF0YVN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsICcgICcpXG4gICAgY29uc3QgcHJvY2Vzc2VkUGF0aCA9IGVudlRlbXBsYXRlU3RyaW5nKGZpbGVQYXRoKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocHJvY2Vzc2VkUGF0aCwgZGF0YVN0cmluZylcbiAgfVxufVxuXG5jb25zdCBnZXRNeU1ldGEgPSAoZGF0YSkgPT4gZGF0YS5fbWV0YSAmJiBkYXRhLl9tZXRhW0ZKU09OX01FVEFfREFUQV9LRVldXG5cbmNvbnN0IGVuc3VyZU15TWV0YSA9IChkYXRhKSA9PiB7XG4gIGxldCBteU1ldGEgPSBnZXRNeU1ldGEoZGF0YSlcbiAgaWYgKCFteU1ldGEpIHtcbiAgICBpZiAoZGF0YS5fbWV0YSA9PT0gdW5kZWZpbmVkKSB7IGRhdGEuX21ldGEgPSB7fSB9XG4gICAgaWYgKGRhdGEuX21ldGFbRkpTT05fTUVUQV9EQVRBX0tFWV0gPT09IHVuZGVmaW5lZCkgeyBkYXRhLl9tZXRhW0ZKU09OX01FVEFfREFUQV9LRVldID0ge30gfVxuICAgIG15TWV0YSA9IGdldE15TWV0YShkYXRhKVxuICB9XG5cbiAgcmV0dXJuIG15TWV0YVxufVxuXG4vKipcbiogVXBkYXRlcyAoYnkgcmV0dXJuaW5nKSB0aGUgbmV3IGR5bmFtaWMgcGF0aCBnaXZlbiB0aGUgY3VycmVudCBkYXRhIHBhdGggKHJlbGF0aXZlIHRvIGEgZGF0YSBtb3VudCBvciBsaW5rIHBvaW50KSBhbmRcbiogcHJldmlvdXMgZHluYW1pYyBwYXRoLlxuKi9cbmNvbnN0IHVwZGF0ZWpzb25QYXRoVG9TZWxmID0gKGpzb25Nb3VudFBhdGgsIGpzb25QYXRoVG9TZWxmKSA9PiB7XG4gIGlmIChqc29uTW91bnRQYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4ganNvblBhdGhUb1NlbGYgPT09IHVuZGVmaW5lZFxuICAgICAgPyBqc29uTW91bnRQYXRoXG4gICAgICA6IGAke2pzb25QYXRoVG9TZWxmfSR7anNvbk1vdW50UGF0aH1gXG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbi8qKlxuKiBJbnRlcm5hbCBmdW5jdGlvbiB0byB0ZXN0IGZvciBhbmQgZXh0cmFjdCBtb3VudCBzcGVjcyBmcm9tIHRoZSBwcm92aWRlZCBKU09OIG9iamVjdC5cbiovXG5jb25zdCBnZXRNb3VudFNwZWNzID0gKGRhdGEpID0+IGdldE15TWV0YShkYXRhKT8ubW91bnRTcGVjc1xuXG4vKipcbiogSW50ZXJuYWwgZnVuY3Rpb24gdG8gcHJvY2VzcyBhIG1vdW50IHNwZWMgaW50byB1c2VmdWwgY29tcG9uZW50cyB1dGlsaXplZCBieSB0aGUgYHJlYWRGSlNPTmAgYW5kIGB3cml0ZUZKU09OYC5cbiovXG5jb25zdCBwcm9jZXNzTW91bnRTcGVjID0gKHsgbW50U3BlYywgZGF0YSwgcHJlc2VydmVPcmlnaW5hbCB9KSA9PiB7XG4gIGxldCB7IGRhdGFQYXRoLCBkYXRhRmlsZSwgZGF0YURpciB9ID0gbW50U3BlY1xuXG4gIGRhdGFGaWxlICYmIGRhdGFEaXIgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAmJiB0aHJvdyBuZXcgRXJyb3IoYEJhZCBtb3VudCBzcGVjOyBjYW5ub3Qgc3BlY2lmeSBib3RoIGRhdGEgZmlsZSAoJHtkYXRhRmlsZX0pIGFuZCBkaXJlY3RvcnkgKCR7ZGF0YURpcn0pYClcbiAgIWRhdGFGaWxlICYmICFkYXRhRGlyIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gICAgJiYgdGhyb3cgbmV3IEVycm9yKCdCYWQgbW91bnQgc3BlYzsgbmVpdGhlciBkYXRhIGZpbGUgbm9yIGRpcmVjdG9yeS4nKVxuXG4gIGRhdGFGaWxlICYmIChkYXRhRmlsZSA9IGVudlRlbXBsYXRlU3RyaW5nKGRhdGFGaWxlKSlcbiAgZGF0YURpciAmJiAoZGF0YURpciA9IGVudlRlbXBsYXRlU3RyaW5nKGRhdGFEaXIpKVxuXG4gIGNvbnN0IHsgcGVudWx0aW1hdGVSZWY6IG1vdW50UG9pbnQsIGZpbmFsS2V5LCBuZXdEYXRhIH0gPSBwcm9jZXNzSlNPTlBhdGgoeyBwYXRoIDogZGF0YVBhdGgsIGRhdGEsIHByZXNlcnZlT3JpZ2luYWwgfSlcblxuICByZXR1cm4geyBkYXRhRmlsZSwgZGF0YURpciwgZGF0YVBhdGgsIG1vdW50UG9pbnQsIGZpbmFsS2V5LCBuZXdEYXRhIH1cbn1cblxuLyoqXG4qIEludGVybmFsIGZ1bmN0aW9uIHRvIHRlc3QgZm9yIGFuZCBleHRyYWN0IGxpbmsgc3BlY3MgZnJvbSB0aGUgcHJvdmlkZWQgSlNPTiBvYmplY3QuXG4qL1xuY29uc3QgZ2V0TGlua1NwZWNzID0gKGRhdGEpID0+IGdldE15TWV0YShkYXRhKT8ubGlua1NwZWNzXG5cbi8qKlxuKiBJbnRlcm5hbCBmdW5jdGlvbiB0byBwcm9jZXNzIGEgbGluayBzcGVjIGludG8gdXNlZnVsIGNvbXBvbmVudHMgdXRpbGl6ZWQgYnkgdGhlIGByZWFkRkpTT05gIGFuZCBgd3JpdGVGSlNPTmAuXG4qL1xuY29uc3QgcHJvY2Vzc0xpbmtTcGVjID0gKGxua1NwZWMsIGRhdGEpID0+IHtcbiAgY29uc3QgeyBsaW5rUmVmcywgbGlua1RvLCBsaW5rS2V5OiBrZXlOYW1lIH0gPSBsbmtTcGVjXG5cbiAgY29uc3QgeyBmaW5hbFJlZiwgcGVudWx0aW1hdGVSZWYsIGZpbmFsS2V5IH0gPSBwcm9jZXNzSlNPTlBhdGgoeyBwYXRoIDogbGlua1JlZnMsIGRhdGEgfSlcbiAgY29uc3QgeyBmaW5hbFJlZjogc291cmNlIH0gPSBwcm9jZXNzSlNPTlBhdGgoeyBwYXRoIDogbGlua1RvLCBkYXRhIH0pXG5cbiAgcmV0dXJuIHsgZmluYWxSZWYsIHNvdXJjZSwga2V5TmFtZSwgcGVudWx0aW1hdGVSZWYsIGZpbmFsS2V5IH1cbn1cblxuY29uc3Qgc2hhbGxvd0NvcHkgPSAoaW5wdXQpID0+IEFycmF5LmlzQXJyYXkoaW5wdXQpXG4gID8gaW5wdXQuc2xpY2UoKVxuICA6IHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcgJiYgaW5wdXQgIT09IG51bGxcbiAgICA/IE9iamVjdC5hc3NpZ24oe30sIGlucHV0KVxuICAgIDogaW5wdXRcblxuY29uc3QgcHJvY2Vzc0pTT05QYXRoID0gKHsgcGF0aCwgZGF0YSwgcHJlc2VydmVPcmlnaW5hbCB9KSA9PiB7XG4gIGlmICghcGF0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5vICdkYXRhUGF0aCcgc3BlY2lmaWVkIGZvciBtb3VudCBzcGVjIG1vdW50IHBvaW50LlwiKVxuICB9XG4gIGNvbnN0IHBhdGhUcmFpbCA9IHBhdGguc3BsaXQoJy4nKVxuICBwYXRoVHJhaWwuc2hpZnQoKVxuICBjb25zdCBmaW5hbEtleSA9IHBhdGhUcmFpbC5wb3AoKVxuICBjb25zdCBuZXdEYXRhID0gcHJlc2VydmVPcmlnaW5hbCA/IHNoYWxsb3dDb3B5KGRhdGEpIDogZGF0YVxuXG4gIGxldCBwZW51bHRpbWF0ZVJlZiA9IG5ld0RhdGEgLy8gbm90IG5lY2Vzc2FyaWx5IHBlbnVsdGltYXRlIHlldCwgYnV0IHdpbGwgYmUuLi5cbiAgZm9yIChjb25zdCBrZXkgb2YgcGF0aFRyYWlsKSB7XG4gICAgaWYgKHByZXNlcnZlT3JpZ2luYWwpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNoYWxsb3dDb3B5KHBlbnVsdGltYXRlUmVmW2tleV0pXG4gICAgICBwZW51bHRpbWF0ZVJlZltrZXldID0gcmVzdWx0XG4gICAgICBwZW51bHRpbWF0ZVJlZiA9IHJlc3VsdFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHBlbnVsdGltYXRlUmVmID0gcGVudWx0aW1hdGVSZWZba2V5XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmluYWxSZWYgOiBwZW51bHRpbWF0ZVJlZltmaW5hbEtleV0sXG4gICAgcGVudWx0aW1hdGVSZWYsXG4gICAgZmluYWxLZXksXG4gICAgbmV3RGF0YVxuICB9XG59XG5cbi8vIGFsaWFzZXMgZm9yICdpbXBvcnQgKiBhcyBmanNvbjsgZmpzb24ud3JpdGUoKScgc3R5bGVcbmNvbnN0IHdyaXRlID0gd3JpdGVGSlNPTlxuY29uc3QgcmVhZCA9IHJlYWRGSlNPTlxuXG5leHBvcnQge1xuICBhZGRNb3VudFBvaW50LCByZWFkRkpTT04sIHNldFNvdXJjZSwgd3JpdGVGSlNPTiwgLy8gc3RhbmRhcmQgaW50ZXJmYWNlXG4gIEZKU09OX01FVEFfREFUQV9LRVksIC8vIHBvc3NpYmx5IHVzZWZ1bD8gbWF5IGJlIHJlbW92ZWQgYmVmb3JlICcxLjAnXG4gIHdyaXRlLCByZWFkIC8vIGFsaWFzZXNcbn1cbiJdLCJuYW1lcyI6WyJyZXBsYWNlUkUiLCJlbnZUZW1wbGF0ZVN0cmluZyIsInBhdGgiLCJvcmlnUGF0aCIsIm1hdGNoZXMiLCJtYXRjaEFsbCIsImxlbmd0aCIsInJldmVyc2UiLCJtYXRjaEluZm8iLCJtYXRjaCIsImtleSIsInZhbHVlIiwicHJvY2VzcyIsImVudiIsIm1hdGNoU3RhcnQiLCJpbmRleCIsInVuZGVmaW5lZCIsIkVycm9yIiwic3Vic3RyaW5nIiwidGVzdEpzb25QYXRocyIsInBhdGhBIiwicGF0aEIiLCJTdHJpbmciLCJwYXRoQUJpdHMiLCJzcGxpdCIsInBhdGhCQml0cyIsInNoaWZ0IiwiYUJpdCIsImJCaXQiLCJGSlNPTl9NRVRBX0RBVEFfS0VZIiwiYWRkTW91bnRQb2ludCIsImRhdGEiLCJkYXRhUGF0aCIsImRhdGFGaWxlIiwibW91bnRTcGVjcyIsImdldE1vdW50U3BlY3MiLCJteU1ldGEiLCJlbnN1cmVNeU1ldGEiLCJpIiwiZmluZEluZGV4IiwiZWwiLCJtb3VudFNwZWMiLCJwdXNoIiwianNvblJFIiwicmVhZEZKU09OIiwiZmlsZVBhdGgiLCJvcHRpb25zIiwicmVtZW1iZXJTb3VyY2UiLCJwcm9jZXNzZWRQYXRoIiwiZnMiLCJleGlzdHNTeW5jIiwibXNnIiwiZGF0YUJpdHMiLCJyZWFkRmlsZVN5bmMiLCJKU09OIiwicGFyc2UiLCJlIiwiU3ludGF4RXJyb3IiLCJtZXNzYWdlIiwic2V0U291cmNlIiwibW50U3BlYyIsInByb2Nlc3NNb3VudFNwZWMiLCJkYXRhRGlyIiwibW91bnRQb2ludCIsImZpbmFsS2V5Iiwic3ViRGF0YSIsIm1udE9iaiIsImZpbGVzIiwicmVhZGRpclN5bmMiLCJ3aXRoRmlsZVR5cGVzIiwiZmlsdGVyIiwiaXRlbSIsImlzRGlyZWN0b3J5IiwidGVzdCIsIm5hbWUiLCJtYXAiLCJkaXJGaWxlIiwibW50UG50IiwicmVwbGFjZSIsImpvaW4iLCJnZXRMaW5rU3BlY3MiLCJsbmtTcGVjIiwicHJvY2Vzc0xpbmtTcGVjIiwiZmluYWxSZWYiLCJzb3VyY2UiLCJrZXlOYW1lIiwicGVudWx0aW1hdGVSZWYiLCJnZXRSZWFsSXRlbSIsInNvdXJlIiwiZmluZCIsImNhbmRpZGF0ZSIsImxpbmtUbyIsIkFycmF5IiwiaXNBcnJheSIsInJlYWxJdGVtcyIsInNwbGljZSIsIk9iamVjdCIsImtleXMiLCJzb3VyY2VGaWxlIiwid3JpdGVGSlNPTiIsInNhdmVGcm9tIiwianNvblBhdGhUb1NlbGYiLCJnZXRNeU1ldGEiLCJkb1NhdmUiLCJwcmVzZXJ2ZU9yaWdpbmFsIiwibmV3RGF0YSIsInVwZGF0ZWpzb25QYXRoVG9TZWxmIiwibWtkaXJTeW5jIiwic3ViS2V5IiwiZGF0YVN0cmluZyIsInN0cmluZ2lmeSIsIndyaXRlRmlsZVN5bmMiLCJfbWV0YSIsImpzb25Nb3VudFBhdGgiLCJwcm9jZXNzSlNPTlBhdGgiLCJsaW5rU3BlY3MiLCJsaW5rUmVmcyIsImxpbmtLZXkiLCJzaGFsbG93Q29weSIsImlucHV0Iiwic2xpY2UiLCJhc3NpZ24iLCJwYXRoVHJhaWwiLCJwb3AiLCJyZXN1bHQiLCJ3cml0ZSIsInJlYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUN0QixFQUFFLHlCQUF5QixDQUFDO0FBQzVCO0FBQ0EsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO0FBQzNFLElBQUksY0FBYyxHQUFHLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDckQsTUFBTSxPQUFPLE9BQU8sR0FBRyxDQUFDO0FBQ3hCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ2pGLEdBQUcsTUFBTTtBQUNULElBQUksY0FBYyxHQUFHLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksR0FBRyxLQUFLLE1B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
