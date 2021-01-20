/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `dataPath` and `dataFile` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as fs from 'fs'

import { processPath } from './utils'

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

  const processedPath = processPath(filePath)
  if (!fs.existsSync(processedPath)) {
    const msg = `No such file: '${filePath}'` + (filePath !== processedPath ? ` ('${processedPath}')` : '')
    throw new Error(msg)
  }
  const dataBits = fs.readFileSync(processedPath)
  const data = JSON.parse(dataBits)

  if (rememberSource) {
    setSource(data, filePath)
  }

  const mountSpecs = getMountSpecs(data)
  if (mountSpecs) {
    for (const mntSpec of mountSpecs) {
      const { dataFile, mountPoint, finalKey } = processMountSpec(mntSpec, data)
      const subData = readFJSON(dataFile)

      mountPoint[finalKey] = subData
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
  const processedPath = processPath(filePath)
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
const getMountSpecs = (data) => {
  const myMeta = getMyMeta(data)
  return myMeta && myMeta.mountSpecs
}

/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processMountSpec = (mntSpec, data) => {
  let { dataPath, dataFile } = mntSpec

  dataFile = processPath(dataFile)

  const pathTrail = dataPath.split('/')
  const finalKey = pathTrail.pop()

  let mountPoint = data
  for (const key of pathTrail) {
    mountPoint = mountPoint[key]
  }

  return { dataFile, mountPoint, finalKey }
}

// aliases for 'import * as fjson; fjson.write()' style
const write = writeFJSON
const read = readFJSON

export {
  addMountPoint, readFJSON, setSource, writeFJSON, // standard interface
  FJSON_META_DATA_KEY, // possibly useful? may be removed before '1.0'
  write, read // aliases
}
