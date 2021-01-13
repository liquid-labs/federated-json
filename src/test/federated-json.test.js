/* global beforeAll describe expect test */

import * as fs from 'fs'

import { readFJSON, writeFJSON, FJSON_DATA_SPACE_KEY } from '../federated-json'

const testDir = '/tmp/federated-json.test'
const expectedBaz = "just a string"
const expectedRootObject = {
  "_meta": {
    "com.liquid-labs.federated-json": {
      "mountSpecs": [
        { "dataPath": "foo/bar", "dataFile": "${LIQ_PLAYGROUND}/liquid-labs/federated-json/src/test/foo-bar.json" }
      ]
    }
  },
  "foo": {
    "bar": {
      "_meta": {
        "com.liquid-labs.federated-json": {
          "mountSpecs": [
            { "dataPath": "baz", "dataFile": "${LIQ_PLAYGROUND}/liquid-labs/federated-json/src/test/baz.json" }
          ]
        }
      },
      "baz": expectedBaz,
      "some-key": "I'm a string!"
    },
    "boolean": true
  },
  "other-data": 123
}


describe('readFJSON', () => {
  test.each`
    description | file | expected
    ${'empty-object.json/trivial object'} | ${'./src/test/empty-object.json'} | ${{}}
    ${'baz.json/simple string'} | ${'./src/test/baz.json'} | ${expectedBaz}
    ${'root-object.json/complex object'} | ${'./src/test/root-object.json'} | ${expectedRootObject}
  `('loads $description', ({file, expected}) => {
    const data = readFJSON(file)
    expect(data).toEqual(expected)
  })
})

describe('writeFJSON', () => {
  beforeAll(() => {
    fs.rmdirSync(testDir, { recursive: true })
    fs.mkdirSync(testDir)
  })

  test('write {}', () => {
    const testFile = `${testDir}/empty-object.json`
    const testData = {}
    writeFJSON(testFile, testData)
    const contents = fs.readFileSync(testFile)
    expect(JSON.parse(contents)).toEqual(testData)
  })

  test('write single embed', () => {
    const rootTestFile = `${testDir}/single-embed-object.json`
    const barTestFile = `${testDir}/bar.json`
    const testEmbed = { "bar": "I'm an embed!" }
    const testData = {
      "_meta": { [FJSON_DATA_SPACE_KEY]: { "mountSpecs": [ { "dataPath": "foo", "dataFile": barTestFile } ] } },
      "foo": testEmbed
    }
    writeFJSON(rootTestFile, testData)

    // the written object will have a 'null' foo
    testData.foo = null
    const rootContents = fs.readFileSync(rootTestFile)
    expect(JSON.parse(rootContents)).toEqual(testData)

    const barContents = fs.readFileSync(barTestFile)
    expect(JSON.parse(barContents)).toEqual(testEmbed)
  })
})
