/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `dataPath` and `dataFile` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as dotenv from 'dotenv'
import * as fs from 'fs'

const FJSON_DATA_SPACE_KEY = 'com.liquid-labs.federated-json'

const replaceRE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g

const processPath = (path) => {
  const matches = [...path.matchAll(replaceRE)]
  matches.reverse() // The reverse allows us to use the start and end indexes without messing up the string.
  for (const matchInfo of matches) {
    const match = matchInfo[0]
    const key = matchInfo[1]
    const value = process.env[key]
    const matchStart = matchInfo.index
    if (value === undefined) {
      throw new Error(`Could not process path replacement for '${key}'; no such environment parameter found.`)
    }
    path = path.substring(0, matchStart) + value + path.substring(matchStart + match.length)
  }

  return path
}

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
* Set the 'LIQ_PLAYGROUND' environment variable to the provided `path` or from the standard liq settings. Primarily
* used for library setup and testing.
*/
const setLiqPlayground = (path) => {
  if (path !== undefined) {
    process.env.LIQ_PLAYGROUND = path
  }
  else if (!process.env.LIQ_PLAYGROUND) {
    const envResult = dotenv.config({ path : `${process.env.HOME}/.liq/settings.sh` })
    if (envResult.error) {
      throw envResult.error
    }
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

const getMyMeta = (data) => data._meta && data._meta[FJSON_DATA_SPACE_KEY]

const ensureMyMeta = (data) => {
  let myMeta = getMyMeta(data)
  if (!myMeta) {
    if (data._meta === undefined) { data._meta = {} }
    if (data._meta[FJSON_DATA_SPACE_KEY] === undefined) { data._meta[FJSON_DATA_SPACE_KEY] = {} }
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

setLiqPlayground()

export { addMountPoint, FJSON_DATA_SPACE_KEY, processPath, readFJSON, setLiqPlayground, setSource, writeFJSON }
