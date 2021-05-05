'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

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
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

  var matches = toConsumableArray(path.matchAll(replaceRE));

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

  return path;
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files.
*/


var readFJSON = function readFJSON(filePath, options) {
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

      var _processMountSpec = processMountSpec(mntSpec, data),
          dataFile = _processMountSpec.dataFile,
          mountPoint = _processMountSpec.mountPoint,
          finalKey = _processMountSpec.finalKey;

      var subData = readFJSON(dataFile);
      mountPoint[finalKey] = subData;
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
        finalRef.splice.apply(finalRef, [0, finalRef.length].concat(toConsumableArray(realItems)));
      } else if (_typeof_1(finalRef) === 'object') {
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


var writeFJSON = function writeFJSON(data, filePath) {
  if (filePath === undefined) {
    var myMeta = getMyMeta(data);
    filePath = myMeta && myMeta.sourceFile;
  }

  if (!filePath) {
    throw new Error('No explicit filePath provided and no source found in object meta data.');
  }

  var mountSpecs = getMountSpecs(data);

  if (mountSpecs) {
    var _iterator3 = _createForOfIteratorHelper$1(mountSpecs),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var mntSpec = _step3.value;

        var _processMountSpec2 = processMountSpec(mntSpec, data),
            mountPoint = _processMountSpec2.mountPoint,
            finalKey = _processMountSpec2.finalKey;

        var subData = mountPoint[finalKey];
        mountPoint[finalKey] = null;
        writeFJSON(subData, mntSpec.dataFile);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  var dataString = JSON.stringify(data);
  var processedPath = envTemplateString(filePath);
  fs.writeFileSync(processedPath, dataString);
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
* Internal function to test for and extract mount specs from the provided JSON object.
*/


var getMountSpecs = function getMountSpecs(data) {
  var _getMyMeta;

  return (_getMyMeta = getMyMeta(data)) === null || _getMyMeta === void 0 ? void 0 : _getMyMeta.mountSpecs;
};
/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/


var processMountSpec = function processMountSpec(mntSpec, data) {
  var dataPath = mntSpec.dataPath,
      dataFile = mntSpec.dataFile;
  dataFile = envTemplateString(dataFile);

  var _processJSONPath = processJSONPath(dataPath, data),
      mountPoint = _processJSONPath.penultimateRef,
      finalKey = _processJSONPath.finalKey;

  return {
    dataFile: dataFile,
    mountPoint: mountPoint,
    finalKey: finalKey
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

  var _processJSONPath2 = processJSONPath(linkRefs, data),
      finalRef = _processJSONPath2.finalRef,
      penultimateRef = _processJSONPath2.penultimateRef,
      finalKey = _processJSONPath2.finalKey;

  var _processJSONPath3 = processJSONPath(linkTo, data),
      source = _processJSONPath3.finalRef;

  return {
    finalRef: finalRef,
    source: source,
    keyName: keyName,
    penultimateRef: penultimateRef,
    finalKey: finalKey
  };
};

var processJSONPath = function processJSONPath(path, data) {
  var pathTrail = path.split('/');
  var finalKey = pathTrail.pop();

  if (finalKey === undefined) {
    throw new Error('Path must specify at least one key.');
  }

  var penultimateRef = data; // not necessarily penultimate yet, but will be...

  var _iterator4 = _createForOfIteratorHelper$1(pathTrail),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var key = _step4.value;
      penultimateRef = penultimateRef[key];
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return {
    finalRef: penultimateRef[finalKey],
    penultimateRef: penultimateRef,
    finalKey: finalKey
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
//# sourceMappingURL=index.js.map
