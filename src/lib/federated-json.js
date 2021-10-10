/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `path` and `file` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as fs from 'fs'
import * as fsPath from 'path'

import { envTemplateString, testJsonPaths } from './utils'

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
  const mountSpec = { path : path, file }
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
* files.
*/
const readFJSON = (...args) => {
  let file, rememberSource, separateMeta, _metaData, _metaPaths, _rootPath
  if (!args || args.length === 0) throw new Error("Invalid 'no argument' call to readJSON.")
  else if (typeof args[0] === 'string') {
    file = args[0]
    if (args.length === 2) {
      if (typeof args[1] === 'object')
        ({ rememberSource, separateMeta, _metaData, _metaPaths, _rootPath } = args[1]);
      else throw new Error("Unexpected second argument to readJSON; expects options object.")
    }
    else if (args.length !== 1)
      throw new Error("Invalid call to readFJSON; try expects (string, options) or (options).")
  }
  else { // treat args[0] as object and see what happens!
    if (args.length > 1) {
      throw new Error("Invalid call to readFJSON; when passing options as first arg, it must be the only arg.")
    };
    
    ({ file, rememberSource, separateMeta, _metaData, _metaPaths, _rootPath } = args[0]);
  }
  
  if (!file) { throw new Error(`File path invalid. (${file})`) }

  const processedPath = envTemplateString(file)
  if (!fs.existsSync(processedPath)) {
    const msg = `No such file: '${file}'` + (file !== processedPath ? ` ('${processedPath}')` : '')
    throw new Error(msg)
  }
  const dataBits = fs.readFileSync(processedPath)
  let data // actually, would love 'const', but need to set inside try block and don'w want to expand scope of the try.
  try {
    data = JSON.parse(dataBits)
  }
  catch (e) {
    if (e instanceof SyntaxError) {
      throw new SyntaxError(`${e.message} while processing ${file}`)
    }
  }

  if (rememberSource === true && typeof data === 'object' && !Array.isArray(data)) {
    setSource({ data, file })
  }

  let requireMeta = false
  // this should only be true for the root object, se we initaliez the structures here and then pass them through as we
  // process the sub-files
  if (_metaData === undefined) {
    _metaData = {}
    _metaPaths = []
  }
  
  const myMeta = getMyMeta(data)
  if (myMeta !== undefined) {
    const myPath = _rootPath || '.'
    _metaPaths.push(myPath)
    // TODO: currently limited to mount paths traversing objects only
    let currRef = _metaData
    if (myPath !== '.') {
      const currPath = myPath.split('.')
      currPath.shift()
      for (const entry of currPath) {
        currRef[entry] = {}
        currRef = currRef[entry]
      }
    }
    currRef._meta = { [FJSON_META_DATA_KEY] : myMeta }
    _metaData = currRef
  }

  for (const mntSpec of myMeta?.mountSpecs || []) {
    const { file, dir, path, mountPoint, finalKey } = processMountSpec({ mntSpec, data })
    
    if (file) {
      let subData = readFJSON({
        file,
        rememberSource,
        separateMeta,
        _metaData,
        _metaPaths,
        rootPath: `${_rootPath || ''}${path}`
      })
      if (separateMeta) {
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
          file: fsPath.join(dir, dirFile),
          rememberSource,
          separateMeta,
          _metaData,
          _metaPaths,
          rootPath: `${_rootPath || ''}${path}`
        })
        if (separateMeta) {
          subData = subData[0]
          delete subData._meta
        }
        mntObj[mntPnt] = subData
      }
    }
  }

  for (const lnkSpec of getLinkSpecs(data) || []) {
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
    ? [ data, _metaData ]
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
const writeFJSON = ({ data, file, saveFrom, jsonPathToSelf }) => {
  if (file === undefined) {
    const myMeta = getMyMeta(data)
    file = myMeta?.sourceFile
    if (!file) { throw new Error('File was not provided and no \'meta.sourceFile\' defined (or invalid).') }
  }

  const doSave = saveFrom === undefined || (jsonPathToSelf && testJsonPaths(saveFrom, jsonPathToSelf))
  if (doSave && !file) {
    throw new Error('No explicit file provided and no source found in object meta data.')
  }

  const mountSpecs = getMountSpecs(data)
  if (mountSpecs) {
    for (const mntSpec of mountSpecs) {
      const { file: specFile, dir, path, mountPoint, finalKey, newData } =
        processMountSpec({ mntSpec, data, preserveOriginal : true })
      data = newData

      const subData = mountPoint[finalKey]
      mountPoint[finalKey] = null
      // What's our save scheme? Single data file, or a scan dir?
      if (specFile) {
        writeFJSON({
          data           : subData,
          file       : specFile,
          saveFrom,
          jsonPathToSelf : updatejsonPathToSelf(path, jsonPathToSelf)
        })
      }
      else { // processMountSpec will raise an exception if neither file nor dir is defined.
        // We don't bother to test what 'dir' is. If it exists, we won't overwrite, so the subsequent attempt to
        // write a file into it can just fail if it's not of an appropriate type.
        fs.existsSync(dir) || fs.mkdirSync(dir)

        for (const subKey of Object.keys(subData)) {
          writeFJSON({
            data           : subData[subKey],
            file       : fsPath.join(dir, `${subKey}.json`),
            saveFrom,
            jsonPathToSelf : updatejsonPathToSelf(`${path}.${subKey}`, jsonPathToSelf)
          })
        }
      }
    }
  }

  if (doSave) {
    const dataString = JSON.stringify(data, null, '  ')
    const processedPath = envTemplateString(file)
    fs.writeFileSync(processedPath, dataString)
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

/**
* Updates (by returning) the new dynamic path given the current data path (relative to a data mount or link point) and
* previous dynamic path.
*/
const updatejsonPathToSelf = (jsonMountPath, jsonPathToSelf) => {
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
const processMountSpec = ({ mntSpec, data, preserveOriginal }) => {
  let { path, file, dir } = mntSpec

  file && dir // eslint-disable-line no-unused-expressions
    && throw new Error(`Bad mount spec; cannot specify both data file (${file}) and directory (${dir})`)
  !file && !dir // eslint-disable-line no-unused-expressions
    && throw new Error('Bad mount spec; neither data file nor directory.')

  file && (file = envTemplateString(file))
  dir && (dir = envTemplateString(dir))

  const { penultimateRef: mountPoint, finalKey, newData } = processJSONPath({ path : path, data, preserveOriginal })

  return { file, dir, path, mountPoint, finalKey, newData }
}

/**
* Internal function to test for and extract link specs from the provided JSON object.
*/
const getLinkSpecs = (data) => getMyMeta(data)?.linkSpecs

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
  addMountPoint, readFJSON, setSource, writeFJSON, // standard interface
  FJSON_META_DATA_KEY, // possibly useful? may be removed before '1.0'
  write, read // aliases
}
