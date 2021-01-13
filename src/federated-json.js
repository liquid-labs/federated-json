/**
* Library that builds a single JSON object from multiple JSON files. As each file is loaded, we check
* `_meta/com.liquid-labs.federated-data/mountSpecs`. Each spec consists of a `dataPath` and `dataFile` element. The
* data path is split on '/' and each element is treated as a string. Therefore, the path is compatible with object keys
* but does not support arrays.
*/
import * as dotenv from 'dotenv'
import * as fs from 'fs'

const FJSON_DATA_SPACE_KEY = 'com.liquid-labs.federated-json'

if (!process.env.LIQ_PLAYGROUND) {
  const envResult = dotenv.config({ path: `${process.env.HOME}/.liq/settings.sh` })
  if (envResult.error) {
    throw envResult.error
  }
}

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

const writeFJSON = (filePath, data) => {
  const mountSpecs = getMountSpecs(data)
  if (mountSpecs) {
    for (const mntSpec of mountSpecs) {
      const { mountPoint, finalKey } = processMountSpec(mntSpec, data)

      const subData = mountPoint[finalKey]
      mountPoint[finalKey] = null

      writeFJSON(mntSpec.dataFile, subData)
    }
  }

  const dataString = JSON.stringify(data)
  fs.writeFileSync(filePath, dataString)
}

const getMountSpecs = (data) =>
  data._meta && data._meta[FJSON_DATA_SPACE_KEY] && data._meta[FJSON_DATA_SPACE_KEY].mountSpecs

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

export { readFJSON, writeFJSON, FJSON_DATA_SPACE_KEY }
