'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = _interopDefault(require('path'));

/* @flow */
/*::

type DotenvParseOptions = {
  debug?: boolean
}

// keys and values from src
type DotenvParseOutput = { [string]: string }

type DotenvConfigOptions = {
  path?: string, // path to .env file
  encoding?: string, // encoding of .env file
  debug?: string // turn on logging for debugging purposes
}

type DotenvConfigOutput = {
  parsed?: DotenvParseOutput,
  error?: Error
}

*/




function log (message /*: string */) {
  console.log(`[dotenv][DEBUG] ${message}`);
}

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\n|\r|\r\n/;

// Parses src into an Object
function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
  const debug = Boolean(options && options.debug);
  const obj = {};

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach(function (line, idx) {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      // default undefined or missing values to empty string
      let val = (keyValueArr[2] || '');
      const end = val.length - 1;
      const isDoubleQuoted = val[0] === '"' && val[end] === '"';
      const isSingleQuoted = val[0] === "'" && val[end] === "'";

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end);

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }

      obj[key] = val;
    } else if (debug) {
      log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
    }
  });

  return obj
}

// Populates process.env from .env file
function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
  let dotenvPath = path.resolve(process.cwd(), '.env');
  let encoding /*: string */ = 'utf8';
  let debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path;
    }
    if (options.encoding != null) {
      encoding = options.encoding;
    }
    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    // specifying an encoding returns a string instead of a buffer
    const parsed = parse(fs__default.readFileSync(dotenvPath, { encoding }), { debug });

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key];
      } else if (debug) {
        log(`"${key}" is already defined in \`process.env\` and will not be overwritten`);
      }
    });

    return { parsed }
  } catch (e) {
    return { error: e }
  }
}

var config_1 = config;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var FJSON_DATA_SPACE_KEY = 'com.liquid-labs.federated-json';

var processPath = function processPath(path) {
  // eslint-disable-next-line no-template-curly-in-string
  return path.replace('${LIQ_PLAYGROUND}', process.env.LIQ_PLAYGROUND);
};
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
* Set the 'LIQ_PLAYGROUND' environment variable to the provided `path` or from the standard liq settings. Primarily
* used for library setup and testing.
*/


var setLiqPlayground = function setLiqPlayground(path) {
  if (path !== undefined) {
    process.env.LIQ_PLAYGROUND = path;
  } else if (!process.env.LIQ_PLAYGROUND) {
    var envResult = config_1({
      path: "".concat(process.env.HOME, "/.liq/settings.sh")
    });

    if (envResult.error) {
      throw envResult.error;
    }
  }
};
/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files.
*/


var readFJSON = function readFJSON(filePath, options) {
  var _ref = options || {},
      rememberSource = _ref.rememberSource;

  var processedPath = processPath(filePath);

  if (!fs.existsSync(processedPath)) {
    var msg = "No such file: '".concat(filePath, "'") + (filePath !== processedPath ? " ('".concat(processedPath, "')") : '');
    throw new Error(msg);
  }

  var dataBits = fs.readFileSync(processedPath);
  var data = JSON.parse(dataBits);

  if (rememberSource) {
    setSource(data, filePath);
  }

  var mountSpecs = getMountSpecs(data);

  if (mountSpecs) {
    var _iterator = _createForOfIteratorHelper(mountSpecs),
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
    var _iterator2 = _createForOfIteratorHelper(mountSpecs),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var mntSpec = _step2.value;

        var _processMountSpec2 = processMountSpec(mntSpec, data),
            mountPoint = _processMountSpec2.mountPoint,
            finalKey = _processMountSpec2.finalKey;

        var subData = mountPoint[finalKey];
        mountPoint[finalKey] = null;
        writeFJSON(subData, mntSpec.dataFile);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  var dataString = JSON.stringify(data);
  var processedPath = processPath(filePath);
  fs.writeFileSync(processedPath, dataString);
};

var getMyMeta = function getMyMeta(data) {
  return data._meta && data._meta[FJSON_DATA_SPACE_KEY];
};

var ensureMyMeta = function ensureMyMeta(data) {
  var myMeta = getMyMeta(data);

  if (!myMeta) {
    if (data._meta === undefined) {
      data._meta = {};
    }

    if (data._meta[FJSON_DATA_SPACE_KEY] === undefined) {
      data._meta[FJSON_DATA_SPACE_KEY] = {};
    }

    myMeta = getMyMeta(data);
  }

  return myMeta;
};
/**
* Internal function to test for and extract mount specs from the provided JSON object.
*/


var getMountSpecs = function getMountSpecs(data) {
  var myMeta = getMyMeta(data);
  return myMeta && myMeta.mountSpecs;
};
/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/


var processMountSpec = function processMountSpec(mntSpec, data) {
  var dataPath = mntSpec.dataPath,
      dataFile = mntSpec.dataFile;
  dataFile = processPath(dataFile);
  var pathTrail = dataPath.split('/');
  var finalKey = pathTrail.pop();
  var mountPoint = data;

  var _iterator3 = _createForOfIteratorHelper(pathTrail),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var key = _step3.value;
      mountPoint = mountPoint[key];
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return {
    dataFile: dataFile,
    mountPoint: mountPoint,
    finalKey: finalKey
  };
};

setLiqPlayground();

exports.FJSON_DATA_SPACE_KEY = FJSON_DATA_SPACE_KEY;
exports.addMountPoint = addMountPoint;
exports.readFJSON = readFJSON;
exports.setLiqPlayground = setLiqPlayground;
exports.setSource = setSource;
exports.writeFJSON = writeFJSON;
//# sourceMappingURL=index.js.map
