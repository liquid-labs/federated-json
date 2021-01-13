/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `dataPath` and `dataFile` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as dotenv from 'dotenv'
import * as fs from 'fs'

const FJSON_DATA_SPACE_KEY = 'com.liquid-labs.federated-json'

/**
* Set the 'LIQ_PLAYGROUND' environment variable to the provided `path` or from the standard liq settings. Primarily
* used for library setup and testing.
*/
const setLiqPlayground = (path) => {
  if (path !== undefined) {
    process.env.LIQ_PLAYGROUND = path
  }
  else if (!process.env.LIQ_PLAYGROUND) {
    const envResult = dotenv.config({ path: `${process.env.HOME}/.liq/settings.sh` })
    if (envResult.error) {
      throw envResult.error
    }
  }
}

setLiqPlayground()

/**
* Reads a JSON file and processes for federated mount points to construct a composite JSON object from one or more
* files.
*/
const readFJSON = (filePath) => {
  const dataBits = fs.readFileSync(filePath)
  const data = JSON.parse(dataBits)

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
* Writes a standard or federated JSON file by analysing the objects meta data and breaking the saved files up
* accourding to the configuration.
*/
const writeFJSON = (data, filePath) => {
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
  fs.writeFileSync(filePath, dataString)
}

/**
* Internal function to test for and extract mount specs from the provided JSON object.
*/
const getMountSpecs = (data) =>
  data._meta && data._meta[FJSON_DATA_SPACE_KEY] && data._meta[FJSON_DATA_SPACE_KEY].mountSpecs

/**
* Internal function to process a mount spec into useful components utilized by the `readFJSON` and `writeFJSON`.
*/
const processMountSpec = (mntSpec, data) => {
  let { dataPath, dataFile } = mntSpec

  dataFile = dataFile.replace('${LIQ_PLAYGROUND}', process.env.LIQ_PLAYGROUND)

  const pathTrail = dataPath.split('/')
  const finalKey = pathTrail.pop()

  let mountPoint = data
  for (const key of pathTrail) {
    mountPoint = mountPoint[key]
  }

  return { dataFile, mountPoint, finalKey }
}

export { FJSON_DATA_SPACE_KEY, readFJSON, setLiqPlayground, writeFJSON }
