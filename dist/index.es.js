import { readFileSync, writeFileSync } from 'fs';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var DATA_SPACE_KEY = 'com.liquid-labs.federated-data';

var readFJSON = function readFJSON(filePath) {
  var dataBits = readFileSync(filePath);
  var data = JSON.parse(dataBits);
  var mountSpecs = getMountSpecs(data);

  if (mountSpecs) {
    var _iterator = _createForOfIteratorHelper(mountSpecs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var mntSpec = _step.value;

        var _processMountSpec = processMountSpec(mntSpec),
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

var writeFJSON = function writeFJSON(filePath, data) {
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
        writeFJSON(mntSpec.dataFile, subData);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  var dataString = JSON.stringify(data);
  writeFileSync(filePath, dataString);
};

var getMountSpecs = function getMountSpecs(data) {
  return data._meta && data._meta[DATA_SPACE_KEY] && data._meta[DATA_SPACE_KEY].mountSpecs;
};

var processMountSpec = function processMountSpec(mntSpec, data) {
  var dataPath = mntSpec.dataPath,
      dataFile = mntSpec.dataFile;
  var pathTrail = dataPath.split();
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

export { readFJSON, writeFJSON };
//# sourceMappingURL=index.es.js.map
