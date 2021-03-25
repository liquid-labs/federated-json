/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `dataPath` and `dataFile` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as fs from 'fs'

import { envTemplateString } from './utils'

const FJSON_META_DATA_KEY = 'com.liquid-labs.federated-json'

/**
* Adds or updates a mount point entry. WARNING: This method does not currently support sub-mounts. These must be
* manually updated by accessing the sub-data structure and modifying it's mount points directly.
*/
const addMountPoint = (data, dataPath, dataFile) => {
  let mountSpecs = getMountSpecs(data)

  if (mountSpecs === undefined) {
    mountSpecs = []
    const myMeta = ensureMyMeta(data)
    if (myMeta.mountSpecs === undefined) {
      myMeta.mountSpecs = mountSpecs
    }
  }

  const i = mountSpecs.findIndex((el) => el.dataPath === dataPath)
  const mountSpec = { dataPath : dataPath, dataFile }
  if (i !== -1) {
    mountSpecs[i] = mountSpec
  }
  else {
    mountSpecs.push(mountSpec)
  }
}

/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files.
*/
const readFJSON = (filePath, options) => {
  const { rememberSource } = options || {}

  const processedPath = envTemplateString(filePath)
  if (!fs.existsSync(processedPath)) {
    const msg = `No such file: '${filePath}'` + (filePath !== processedPath ? ` ('${processedPath}')` : '')
    throw new Error(msg)
  }
  const dataBits = fs.readFileSync(processedPath)
  const data = JSON.parse(dataBits)

  if (rememberSource) {
    setSource(data, filePath)
  }

  for (const mntSpec of getMountSpecs(data) || []) {
    const { dataFile, mountPoint, finalKey } = processMountSpec(mntSpec, data)
    const subData = readFJSON(dataFile)

    mountPoint[finalKey] = subData
  }

  for (const lnkSpec of getLinkSpecs(data) || []) {
    const { refContainer, source, keyName, penultimateContainer, finalKey } = processLinkSpec(lnkSpec, data)

    const getRealItem = (soure, keyName, key) => {
      const realItem = source[keyName]
      realItem !== undefined || throw new Error(`Cannot find link '${key}' in '${lnk.linkTo}'.`)
      return realItem
    }

    if (Array.isArray(refContainer)) { // replace the contents
      const realItems = refContainer.map((key) => getRealItem(source, keyName, key))
      refContainer.splice(0, refContainer.length, ...realItems)
    }
    else if (typeof refContainer === 'object'){
      for (const key of Object.keys(refContainer)) {
        refContianer[key] = getRealItem(source, keyName, key)
      }
    }
    else { // it's a single key
      penultimateContainer[finalKey] = getRealItem(source, keyName, refContainer)
    }
  }

  return data
}

/**
* Set's the meta source information.
*/
const setSource = (data, filePath) => {
  const myMeta = ensureMyMeta(data)
  myMeta.sourceFile = filePath
}

/**
* Writes a standard or federated JSON file by analysing the objects meta data and breaking the saved files up
* accourding to the configuration.
*/
const writeFJSON = (data, filePath) => {
  if (filePath === undefined) {
    const myMeta = getMyMeta(data)
    filePath = myMeta && myMeta.sourceFile
  }
  if (!filePath) {
    throw new Error('No explicit filePath provided and no source found in object meta data.')
  }

  const mountSpecs = getMountSpecs(data)
  if (mountSpecs) {
    for (const mntSpec of mountSpecs) {
      const { mountPoint, finalKey } = processMountSpec(mntSpec, data)

      const subData = mountPoint[finalKey]
      mountPoint[finalKey] = null

      writeFJSON(subData, mntSpec.dataFile)
    }
  }

  const dataString = JSON.stringify(data)
  const processedPath = envTemplateString(filePath)
  fs.writeFileSync(processedPath, dataString)
}

const getMyMeta = (data) => data._meta && data._meta[FJSON_META_DATA_KEY]

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
* Internal function to test for and extract mount specs from the provided JSON object.
*/
const getMountSpecs = (data) => getMyMeta(data)?.mountSpecs

/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processMountSpec = (mntSpec, data) => {
  let { dataPath, dataFile } = mntSpec

  dataFile = envTemplateString(dataFile)

  const { penultimateRef: mountPoint, finalKey } = processJSONPath(dataPath, data)

  return { dataFile, mountPoint, finalKey }
}

/**
* Internal function to test for and extract link specs from the provided JSON object.
*/
const getLinkSpecs = (data) => getMyMeta(data)?.linkSpecs

/**
* Internal function to process a link spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processLinkSpec = (lnkSpec, data) => {
  let { linkRefs, linkTo, linkKey: keyName } = lnkSpec

  const { finalRef, penultimateRef, finalKey } = processJSONPath(linkRefs, data)
  const { finalRef: source } = processJSONPath(linkTo, data)

  return { finalRef, source, keyName, penultimateRef, finalKey }
}

const processJSONPath = (path, data) => {
  const pathTrail = path.split('/')
  const finalKey = pathTrail.pop()
  finalKey !== undefined || throw new Exception('Path must specify at least one key.')

  let penultimateRef = data // not necessarily penultimate yet, but will be...
  for (const key of pathTrail) {
    penultimateRef = penultimateRef[key]
  }

  return {
    finalRef: penultimateRef[finalKey],
    penultimateRef,
    finalKey
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
