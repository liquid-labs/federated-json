/* global beforeAll beforeEach describe expect test */

import * as fs from 'fs'

import { addMountPoint, FJSON_META_DATA_KEY, readFJSON, setSource, writeFJSON } from '../federated-json'

// test constants
const testDir = '/tmp/federated-json.test'

const expectedBaz = 'just a string'

const expectedRootObject = {
  _meta : {
    [FJSON_META_DATA_KEY] : {
      mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
        { dataPath : 'foo/bar', dataFile : '${TEST_DIR}/data/foo-bar.json' }
      ]
    }
  },
  foo : {
    bar : {
      _meta : {
        [FJSON_META_DATA_KEY] : {
          mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
            { dataPath : 'baz', dataFile : '${TEST_DIR}/data/baz.json' }
          ]
        }
      },
      baz        : expectedBaz,
      'some-key' : "I'm a string!"
    },
    boolean : true
  },
  'other-data' : 123
}

const linkyBarRef = { name : 'bar' }
const linkyBazRef = { name : 'baz', value : true }
const linkyBase = {
  _meta : {
    [FJSON_META_DATA_KEY] : {
      linkSpecs : [
        { linkRefs : 'foo', linkTo : 'source', linkKey : 'name' }
      ]
    }
  },
  source : [linkyBarRef, linkyBazRef]
}
const expectedArr2Arr = Object.assign({ foo : [linkyBarRef, linkyBazRef] }, linkyBase)
const expectedObj2Arr = Object.assign({ foo : { bar : linkyBarRef, baz : linkyBazRef } }, linkyBase)
const expectedStr2Arr = Object.assign({ foo : linkyBarRef }, linkyBase)
const expectedFedLinkArr2Arr = Object.assign({}, expectedArr2Arr)
expectedFedLinkArr2Arr._meta = Object.assign({}, expectedArr2Arr._meta)
expectedFedLinkArr2Arr._meta[FJSON_META_DATA_KEY] = Object.assign({
  mountSpecs : [{ // eslint-disable-next-line no-template-curly-in-string
    dataFile : '${TEST_DIR}/data/fed-link-source.json',
    dataPath : 'source'
  }]
},
expectedFedLinkArr2Arr._meta[FJSON_META_DATA_KEY])
const expectedScanResult = {
  "_meta": {
    "com.liquid-labs.federated-json": {
      "mountSpecs": [ { "dataDir": "${TEST_DIR}/data/datadir", "dataPath": "data" } ]
    }
  },
  "data": {
    "bar": [ 1, 2, 3 ],
    "baz": { "stuff": true },
    "foo": "foo",
  }
}


const testDataPath = './src/lib/test/data'
const EMPTY_OBJ_SRC = `${testDataPath}/empty-object.json`
// end test constants
// setup environment for test
process.env.TEST_DIR = __dirname

describe('addMountPoint', () => {
  let data
  beforeEach(() => { data = { foo : { bar : true }, baz : true } })

  test('sets initial root mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './some-file.json' }] }
    })
  })

  test('sets initial root mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './some-file.json' }] }
    })
  })

  test('updates mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    addMountPoint(data, 'foo', './another-file.json')
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './another-file.json' }] }
    })
  })

  test('plays nice with setSource', () => {
    const metaModel = {
      [FJSON_META_DATA_KEY] : { sourceFile : './our-file.json' }
    }
    setSource(data, './our-file.json')
    expect(data._meta).toEqual(metaModel)

    addMountPoint(data, 'foo', './some-file.json')
    metaModel[FJSON_META_DATA_KEY].mountSpecs = [{ dataPath : 'foo', dataFile : './some-file.json' }]
    expect(data._meta).toEqual(metaModel)

    addMountPoint(data, 'foo', './another-file.json')
    metaModel[FJSON_META_DATA_KEY].mountSpecs = [{ dataPath : 'foo', dataFile : './another-file.json' }]
    expect(data._meta).toEqual(metaModel)
  })

  /* TODO
  test('sets embedded mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    addMountPoint(data, 'foo/bar', './another-file.json')
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY]: { "mountSpecs": [{ "dataPath": "foo", "dataFile": "./some-file.json"}] }
    })
    expect(data.foo._meta).toEqual({
      [FJSON_META_DATA_KEY]: { "mountSpecs": [{ "dataPath": "bar", "dataFile": "./another-file.json"}] }
    })
  }) */
})

describe('readFJSON', () => {
  test.each`
    description | file | expected
    ${'empty-object.json/trivial object'} | ${EMPTY_OBJ_SRC} | ${{}}
    ${'baz.json/simple string'} | ${testDataPath + '/baz.json'} | ${expectedBaz}
    ${'root-object.json/federated object'} | ${testDataPath + '/root-object.json'} | ${expectedRootObject}
    ${'link-arr2arr.json/intra-linked object'} | ${testDataPath + '/link-arr2arr.json'} | ${expectedArr2Arr}
    ${'link-obj2arr.json/intra-linked object'} | ${testDataPath + '/link-obj2arr.json'} | ${expectedObj2Arr}
    ${'link-str2arr.json/intra-linked object'} | ${testDataPath + '/link-str2arr.json'} | ${expectedStr2Arr}
    ${'fed-link-arr2arr.json/fed+linked object'} | ${testDataPath + '/fed-link-arr2arr.json'} | ${expectedFedLinkArr2Arr}
    ${'data-dir.json/scan-and-load'} | ${testDataPath + '/data-dir.json'} | ${expectedScanResult}
  `('loads $description', ({ file, expected }) => {
    const data = readFJSON(file)
    expect(data).toEqual(expected)
  })

  test('can remember the source', () => {
    const data = readFJSON(EMPTY_OBJ_SRC, { rememberSource : true })
    expect(data).toEqual({ _meta : { [FJSON_META_DATA_KEY] : { sourceFile : EMPTY_OBJ_SRC } } })
  })

  test('throws useful error when file not found (no path replacement)', () => {
    const badFileName = '/foo/bar/non-existent-file.json'
    expect(() => { readFJSON(badFileName) }).toThrow(new RegExp(badFileName))
  })

  test('throws useful error when file not found (with path replacement)', () => {
    const badFileBaseName = 'non-existent-file.json'
    const badFileName = `\${HOME}/${badFileBaseName}`
    const processedFileName = `${process.env.HOME}/${badFileBaseName}`
    expect(() => { readFJSON(badFileName) }).toThrow(new RegExp(`\\${badFileName}.*\\('${processedFileName}'\\)`))
  })

  test('throws useful error when JSON syntax is bad.', () => {
    const badSyntaxFile = `${testDataPath}/bad-syntax.json`
    expect(() => { readFJSON(badSyntaxFile) }).toThrow(new RegExp(`unexpected token.*${badSyntaxFile}`, 'i'))
  })
})

describe('writeFJSON', () => {
  beforeAll(() => {
    fs.rmdirSync(testDir, { recursive : true })
    fs.mkdirSync(testDir)
  })

  test('write {}', () => {
    const testFile = `${testDir}/empty-object.json`
    const testData = {}
    writeFJSON(testData, testFile)
    const contents = fs.readFileSync(testFile)
    expect(JSON.parse(contents)).toEqual(testData)
  })

  test('write single file mount', () => {
    const rootTestFile = `${testDir}/single-mount-file.json`
    const barTestFile = `${testDir}/bar.json`
    const testEmbed = { bar : "I'm an embed!" }
    const testData = {
      _meta : { [FJSON_META_DATA_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : barTestFile }] } },
      foo   : testEmbed
    }
    writeFJSON(testData, rootTestFile)

    // the written object will have a 'null' foo
    testData.foo = null
    const rootContents = fs.readFileSync(rootTestFile)
    expect(JSON.parse(rootContents)).toEqual(testData)

    const barContents = fs.readFileSync(barTestFile)
    expect(JSON.parse(barContents)).toEqual(testEmbed)
  })

  test('write single dir mount', () => {
    const rootTestFile = `${testDir}/single-mount-dir.json`
    const barTestDir = `${testDir}/bar`
    const barValue = "I'm an embed!"
    const bazValue = [ 1, 2, "Hi!" ]
    const testEmbed = { bar : barValue, baz: bazValue }
    const testData = {
      _meta : { [FJSON_META_DATA_KEY] : { mountSpecs : [{ dataPath : 'foo', dataDir : barTestDir }] } },
      foo   : testEmbed
    }
    writeFJSON(testData, rootTestFile)

    // the written object will have a 'null' foo
    testData.foo = null
    const rootContents = fs.readFileSync(rootTestFile)
    expect(JSON.parse(rootContents)).toEqual(testData)

    const barContents = fs.readFileSync(`${barTestDir}/bar.json`)
    expect(JSON.parse(barContents)).toEqual(barValue)

    const bazContents = fs.readFileSync(`${barTestDir}/baz.json`)
    expect(JSON.parse(bazContents)).toEqual(bazValue)
  })

  test('write to meta source', () => {
    const testFile = `${testDir}/empty-object.json`
    const testData = {}
    setSource(testData, testFile)
    writeFJSON(testData)
    const contents = fs.readFileSync(testFile)
    expect(JSON.parse(contents)).toEqual(testData)
  })

  test('write fails when no target path can be discerned', () => {
    const testData = {}
    expect(() => writeFJSON(testData)).toThrow()
  })
})
