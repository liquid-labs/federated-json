/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `path` and `file` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as fs from 'node:fs'
import * as fsPath from 'node:path'

import structuredClone from 'core-js-pure/actual/structured-clone'
import yaml from 'js-yaml'

import { envTemplateString, processPath, testJsonPaths } from './utils'

const FJSON_META_DATA_KEY = 'com.liquid-labs.federated-json'

/**
* Adds or updates a mount point entry. WARNING: This method does not currently support sub-mounts. These must be
* manually updated by accessing the sub-data structure and modifying it's mount points directly.
*/
const addMountPoint = ({ data, path, file }) => {
  let mountSpecs = getMountSpecs(data)

  if (mountSpecs === undefined) {
    mountSpecs = []
    const myMeta = ensureMyMeta(data)
    if (myMeta.mountSpecs === undefined) {
      myMeta.mountSpecs = mountSpecs
    }
  }

  const i = mountSpecs.findIndex((el) => el.path === path)
  const mountSpec = { path, file }
  if (i !== -1) {
    mountSpecs[i] = mountSpec
  }
  else {
    mountSpecs.push(mountSpec)
  }
}

const jsonRE = /\.json$/

/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files. May take a single `file` optinally followed by an options object or a single options object containing a
* `file` option.
*
* ### Options
*
* - `file`: (req) the path to the root file.
* - `createOnNone`: will create a file and initialize it to the parameter value if no file exists. The parameter value
*    must be valid JSON. A deep-clone will be created, so you should work with the returned data.
* - `noMtime`: by default, the root files 'modified time' is calculated and stored as `myMeta`. The calculated mtime
*    is greatest mtime of all the federated
* - `overrides`: a map of paths to `file:` or `dir:` paths used to override the meta-defined specs
* - `rememberSource`: remember the source path for the object as `_meta.sourceFile` for objects and the named field
*   sourceFile` for arrays.
* - `separateMeta`: separates the meta data and returns `[data, _metaData]``
*/
const readFJSON = (...args) => {
  let file, parameters

  if (!args || args.length === 0) throw new Error("Invalid 'no argument' call to readFJSON.")
  else if (args.length > 2) throw new Error('Invalid call to readFJSON; try expects (string, options) or (options).')
  else if (typeof args[0] === 'string') {
    file = args[0]
    if (args.length === 2 && args[1] && typeof args[1] !== 'object') {
      throw new Error('Unexpected second argument to readFJSON; expects options object.')
    }
    parameters = args[1] || {}
  }
  else { // treat args[0] as object and see what happens!
    if (args.length > 1) {
      throw new Error('Invalid call to readFJSON; when passing options as first arg, it must be the only arg.')
    }
    parameters = args[0];
    ({ file } = parameters)
  }

  let { _metaData, _metaPaths } = parameters
  const {
    createOnNone,
    noMtime = false,
    overrides,
    rememberSource,
    separateMeta,
    _contextFilePath, _metaDatas = [], _contextJSONPath
  } = parameters

  if (!file) { throw new Error(`File path invalid. (${file})`) }

  const processedPath = processPath(file, _contextFilePath)

  let data // would love to use 'const' here
  if (createOnNone !== undefined && !fs.existsSync(processedPath)) {
    data = structuredClone(createOnNone)
    fs.mkdirSync(fsPath.dirname(file), { recursive : true })
    fs.writeFileSync(file, JSON.stringify(createOnNone, null, '  '))
  }
  else {
    const dataBits = fs.readFileSync(processedPath)
    try {
      data = file.endsWith('.json') ? JSON.parse(dataBits) : yaml.load(dataBits)
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        throw new SyntaxError(`${e.message} while processing ${file}`, { cause : e })
      }
    }
  }

  if (rememberSource === true) {
    if (typeof data === 'object' && !Array.isArray(data)) { setSource({ data, file }) }
    else if (Array.isArray(data)) { data.sourceFile = file }
  }
  if (noMtime === false) {
    const { mtimeMs } = fs.statSync(processedPath)
    if (typeof data === 'object' && !Array.isArray(data)) {
      const myMeta = ensureMyMeta(data)
      myMeta.myMtimeMs = mtimeMs
    }
    else if (Array.isArray(data)) { data.myMtimeMs = mtimeMs }
  }

  // this should only be true for the root object, se we initaliez the structures here and then pass them through as we
  // process the sub-files
  if (_metaData === undefined) {
    _metaData = {}
    _metaPaths = []
  }

  let myMeta = getMyMeta(data)
  if (myMeta !== undefined) {
    _metaDatas.push(myMeta)

    const myPath = _contextJSONPath || '.'
    _metaPaths.push(myPath)
    // TODO: currently limited to mount paths traversing objects only
    let currMetaRef = _metaData
    if (myPath !== '.') {
      const currPath = myPath.split('.')
      currPath.shift()
      for (const entry of currPath) {
        currMetaRef[entry] = {}
        currMetaRef = currMetaRef[entry]
      }
    }
    else if (separateMeta === true) {
      delete data._meta
    }
    currMetaRef._meta = { [FJSON_META_DATA_KEY] : myMeta }
    _metaData = currMetaRef
  }
  else {
    myMeta = {}
  }

  for (const mntSpec of myMeta?.mountSpecs || []) {
    const { file: subFile, dir, path, mountPoint, finalKey } =
      processMountSpec({ data, mntSpec, overrides, sourceFile : file })

    if (subFile) {
      let subData = readFJSON({
        file             : subFile,
        noMtime,
        overrides,
        rememberSource,
        separateMeta,
        _contextFilePath : processedPath,
        _metaData,
        _metaDatas,
        _metaPaths,
        _contextJSONPath : `${_contextJSONPath || ''}${path}`
      })
      if (separateMeta === true) {
        subData = subData[0]
        delete subData._meta
      }
      mountPoint[finalKey] = subData
    }
    else { // 'dir' is good because we expect processMountSpec() to raise an exception if neither specified.
      const mntObj = {}
      mountPoint[finalKey] = mntObj

      const files = fs.readdirSync(dir, { withFileTypes : true })
        .filter(item => !item.isDirectory() && jsonRE.test(item.name))
        .map(item => item.name) // note 'name' is the simple/basename, not the whole path.

      for (const dirFile of files) {
        const mntPnt = dirFile.replace(jsonRE, '')
        let subData = readFJSON({
          file             : fsPath.join(dir, dirFile),
          noMtime,
          overrides,
          rememberSource,
          separateMeta,
          _contextFilePath : processedPath,
          _metaData,
          _metaDatas,
          _metaPaths,
          _contextJSONPath : `${_contextJSONPath || ''}${path}`
        })
        if (separateMeta === true) {
          subData = subData[0]
          delete subData._meta
        }
        mntObj[mntPnt] = subData
      }
    }
  }
  if (noMtime === false) {
    // TODO: is only guaranteed to be correct for the top level data; otherwise the '_metaDatas' might have meta data from data which is not sub-data of the current data
    myMeta.mtimeMs = _metaDatas.reduce((acc, m) => m.myMtimeMs > acc ? m.myMtimeMs : acc, 0)
  }

  for (const lnkSpec of myMeta?.linkSpecs || []) {
    const { finalRef, source, keyName, penultimateRef, finalKey } = processLinkSpec(lnkSpec, data)

    const getRealItem = (soure, keyName, key) =>
      source.find((candidate) => candidate[keyName] === key)
        || throw new Error(`Cannot find link '${key}' in '${lnkSpec.linkTo}'.`)

    if (Array.isArray(finalRef)) { // replace the contents
      const realItems = finalRef.map((key) => getRealItem(source, keyName, key))
      finalRef.splice(0, finalRef.length, ...realItems)
    }
    else if (typeof finalRef === 'object') {
      for (const key of Object.keys(finalRef)) {
        finalRef[key] = getRealItem(source, keyName, key)
      }
    }
    else { // it's a single key
      penultimateRef[finalKey] = getRealItem(source, keyName, finalRef)
    }
  }

  return separateMeta
    ? [data, _metaData]
    : data
}

/**
* Set's the meta source information.
*/
const setSource = ({ data, file }) => {
  const myMeta = ensureMyMeta(data)
  myMeta.sourceFile = file
}

/**
* Writes a standard or federated JSON file by analysing the objects meta data and breaking the saved files up
* accourding to the configuration.
*/
// const writeFJSON = ({ noCreateDirs = false, data, file, noMeta = false, saveFrom, _jsonPathToSelf, _contextFilePath, _contextJSONPath }) => {
const writeFJSON = (options) => {
  let {
    noCreateDirs = false,
    data,
    file,
    leaveInternalMeta = false,
    noMeta = false,
    saveFrom,
    _jsonPathToSelf,
    _contextFilePath,
    _contextJSONPath
  } = options

  if (file === undefined) {
    file = getSourceFile(data)
  }

  const doSave = saveFrom === undefined || (_jsonPathToSelf && testJsonPaths(saveFrom, _jsonPathToSelf))
  if (doSave && !file) {
    throw new Error('No explicit file provided and no source found in object meta data.')
  }

  const processedPath = processPath(file, _contextFilePath)

  const mountSpecs = getMountSpecs(data)
  if (mountSpecs) {
    for (const mntSpec of mountSpecs) {
      const { file: specFile, dir, path, mountPoint, finalKey, newData } =
        processMountSpec({ data, mntSpec, preserveOriginal : true })
      data = newData

      const subData = mountPoint[finalKey]
      mountPoint[finalKey] = null
      // What's our save scheme? Single data file, or a scan dir?
      if (specFile) {
        // TODO: can't we break the loop if we hit a defined saveFrom
        writeFJSON({
          data             : subData,
          file             : specFile,
          leaveInternalMeta,
          noMeta,
          saveFrom,
          _jsonPathToSelf  : updateJsonPathToSelf(path, _jsonPathToSelf),
          _contextFilePath : processedPath,
          _contextJSONPath : `${_contextJSONPath || ''}${path}`
        })
      }
      else {
        for (const subKey of Object.keys(subData)) {
          writeFJSON({
            data             : subData[subKey],
            file             : fsPath.join(dir, `${subKey}.json`),
            leaveInternalMeta,
            noMeta,
            saveFrom,
            _jsonPathToSelf  : updateJsonPathToSelf(`${path}.${subKey}`, _jsonPathToSelf),
            _contextFilePath : processedPath,
            _contextJSONPath : `${_contextJSONPath || ''}${path}`
          })
        }
      }
    }
  }

  if (doSave) {
    if (noMeta === true) delete data._meta
    else {
      const metaData = data?._meta?.['com.liquid-labs.federated-json']
      if (metaData) {
        // by default, we delete the internal metaData added during the load process
        if (leaveInternalMeta === false) {
          delete metaData.sourceFile
          delete metaData.myMtimeMs
          delete metaData.mtimeMs
        }

        // remove empty meta-data entries
        if (Object.keys(metaData).length === 0) {
          delete data._meta['com.liquid-labs.federated-json']
          if (Object.keys(data._meta).length === 0) {
            delete data._meta
          }
        }
      }
    }

    const dataString = processedPath.endsWith('.json') ? JSON.stringify(data, null, '  ') : yaml.dump(data)
    if (noCreateDirs === false) {
      fs.mkdirSync(fsPath.dirname(processedPath), { recursive : true })
    }
    fs.writeFileSync(processedPath, dataString + '\n')
  }
}

const getMyMeta = (data) => data?._meta?.[FJSON_META_DATA_KEY]

const ensureMyMeta = (data) => {
  let myMeta = getMyMeta(data)
  if (!myMeta) {
    if (data._meta === undefined) { data._meta = {} }
    if (data._meta[FJSON_META_DATA_KEY] === undefined) { data._meta[FJSON_META_DATA_KEY] = {} }
    myMeta = getMyMeta(data)
  }

  return myMeta
}

const getSourceFile = (data) => {
  if (typeof data === 'object' && !Array.isArray(data)) {
    const myMeta = getMyMeta(data)
    return myMeta?.sourceFile
  }
  else if (Array.isArray(data)) {
    return data.sourceFile
  }
  return undefined
}

/**
* Updates (by returning) the new dynamic path given the current data path (relative to a data mount or link point) and
* previous dynamic path.
*/
const updateJsonPathToSelf = (jsonMountPath, jsonPathToSelf) => {
  if (jsonMountPath !== undefined) {
    return jsonPathToSelf === undefined
      ? jsonMountPath
      : `${jsonPathToSelf}${jsonMountPath}`
  }
  else {
    return undefined
  }
}

/**
* Internal function to test for and extract mount specs from the provided JSON object.
*/
const getMountSpecs = (data) => getMyMeta(data)?.mountSpecs

/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processMountSpec = ({ data, mntSpec, overrides, preserveOriginal, sourceFile }) => {
  let { path, file, dir } = mntSpec

  if (overrides !== undefined && path in overrides) {
    const override = overrides[path]
    if (override.startsWith('file:')) {
      file = override.substring(5)
      dir = undefined
    }
    else if (override.startsWith('dir:')) {
      dir = override.substring(4)
      file = undefined
    }
    else { throw new Error(`Cannot parse override spec '${override}'. Override spec must start with 'file:' or 'dir:'.`) }
  }
  else {
    file && dir // eslint-disable-line no-unused-expressions
      && throw new Error(`Bad mount spec; cannot specify both data file (${file}) and directory (${dir})${sourceFile ? `; source file: ${sourceFile}` : ''}`)
    !file && !dir // eslint-disable-line no-unused-expressions
      && throw new Error(`Bad mount spec; neither data file nor directory${sourceFile ? `; source file: ${sourceFile}` : ''}.`)
  }

  file && (file = envTemplateString(file))
  dir && (dir = envTemplateString(dir))

  const { penultimateRef: mountPoint, finalKey, newData } = processJSONPath({ path, data, preserveOriginal })

  return { file, dir, path, mountPoint, finalKey, newData }
}

const lastModificationMs = (data, selfOnly = false) => getMyMeta(data).mtimeMs

/**
* Internal function to process a link spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processLinkSpec = (lnkSpec, data) => {
  const { linkRefs, linkTo, linkKey: keyName } = lnkSpec

  const { finalRef, penultimateRef, finalKey } = processJSONPath({ path : linkRefs, data })
  const { finalRef: source } = processJSONPath({ path : linkTo, data })

  return { finalRef, source, keyName, penultimateRef, finalKey }
}

const shallowCopy = (input) => Array.isArray(input)
  ? input.slice()
  : typeof input === 'object' && input !== null
    ? Object.assign({}, input)
    : input

const processJSONPath = ({ path, data, preserveOriginal }) => {
  if (!path) {
    throw new Error("No 'path' specified for mount spec mount point.")
  }
  const pathTrail = path.split('.')
  pathTrail.shift()
  const finalKey = pathTrail.pop()
  const newData = preserveOriginal ? shallowCopy(data) : data

  let penultimateRef = newData // not necessarily penultimate yet, but will be...
  for (const key of pathTrail) {
    if (preserveOriginal) {
      const result = shallowCopy(penultimateRef[key])
      penultimateRef[key] = result
      penultimateRef = result
    }
    else {
      penultimateRef = penultimateRef[key]
    }
  }

  return {
    finalRef : penultimateRef[finalKey],
    penultimateRef,
    finalKey,
    newData
  }
}

// aliases for 'import * as fjson; fjson.write()' style
const write = writeFJSON
const read = readFJSON

export {
  // standard interface
  //   manipulation methods
  addMountPoint,
  getSourceFile,
  readFJSON,
  setSource,
  writeFJSON,
  //   informational
  lastModificationMs,
  // etc
  FJSON_META_DATA_KEY, // possibly useful? may be removed before '1.0'
  write, read // aliases
}
