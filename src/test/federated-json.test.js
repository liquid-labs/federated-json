/* global afterEach beforeAll beforeEach describe expect test */

import * as fs from 'fs'

import { addMountPoint, FJSON_DATA_SPACE_KEY, readFJSON, setLiqPlayground, setSource, writeFJSON } from '../federated-json'

const testDir = '/tmp/federated-json.test'
const expectedBaz = 'just a string'
const expectedRootObject = {
  _meta : {
    'com.liquid-labs.federated-json' : {
      mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
        { dataPath : 'foo/bar', dataFile : '${LIQ_PLAYGROUND}/liquid-labs/federated-json/src/test/foo-bar.json' }
      ]
    }
  },
  foo : {
    bar : {
      _meta : {
        'com.liquid-labs.federated-json' : {
          mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
            { dataPath : 'baz', dataFile : '${LIQ_PLAYGROUND}/liquid-labs/federated-json/src/test/baz.json' }
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

const EMPTY_OBJ_SRC = './src/test/empty-object.json'

describe('setLiqPlayground', () => {
  var LIQ_PLAYGROUND = process.env.LIQ_PLAYGROUND
  afterEach(() => { process.env.LIQ_PLAYGROUND = LIQ_PLAYGROUND })

  test('fails when \'~/.liq/setting.sh\' fails to load', () => {
    process.env.HOME = '/'
    delete process.env.LIQ_PLAYGROUND
    expect(() => setLiqPlayground()).toThrow()
  })

  test('can manually set LIQ_PLAYGROUND', () => {
    const testPath = '/some/path'
    setLiqPlayground(testPath)
    expect(process.env.LIQ_PLAYGROUND).toBe(testPath)
  })

  test('does not override LIQ_PLAYGROUND with default call', () => {
    setLiqPlayground('blah')
    setLiqPlayground()
    expect(process.env.LIQ_PLAYGROUND).toBe('blah')
  })
})

describe('readFJSON', () => {
  test.each`
    description | file | expected
    ${'empty-object.json/trivial object'} | ${EMPTY_OBJ_SRC} | ${{}}
    ${'baz.json/simple string'} | ${'./src/test/baz.json'} | ${expectedBaz}
    ${'root-object.json/complex object'} | ${'./src/test/root-object.json'} | ${expectedRootObject}
  `('loads $description', ({ file, expected }) => {
  const data = readFJSON(file)
  expect(data).toEqual(expected)
})

  test('can remember the source', () => {
    const data = readFJSON(EMPTY_OBJ_SRC, { rememberSource : true })
    expect(data).toEqual({ _meta : { [FJSON_DATA_SPACE_KEY] : { sourceFile : EMPTY_OBJ_SRC } } })
  })
})

describe('addMountPoint', () => {
  let data
  beforeEach(() => { data = { foo : { bar : true }, baz : true } })

  test('sets initial root mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    expect(data._meta).toEqual({
      [FJSON_DATA_SPACE_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './some-file.json' }] }
    })
  })

  test('sets initial root mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    expect(data._meta).toEqual({
      [FJSON_DATA_SPACE_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './some-file.json' }] }
    })
  })

  test('updates mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    addMountPoint(data, 'foo', './another-file.json')
    expect(data._meta).toEqual({
      [FJSON_DATA_SPACE_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : './another-file.json' }] }
    })
  })

  test('plays nice with setSource', () => {
    const metaModel = {
      [FJSON_DATA_SPACE_KEY] : { sourceFile : './our-file.json' }
    }
    setSource(data, './our-file.json')
    expect(data._meta).toEqual(metaModel)

    addMountPoint(data, 'foo', './some-file.json')
    metaModel[FJSON_DATA_SPACE_KEY].mountSpecs = [{ dataPath : 'foo', dataFile : './some-file.json' }]
    expect(data._meta).toEqual(metaModel)

    addMountPoint(data, 'foo', './another-file.json')
    metaModel[FJSON_DATA_SPACE_KEY].mountSpecs = [{ dataPath : 'foo', dataFile : './another-file.json' }]
    expect(data._meta).toEqual(metaModel)
  })

  /* TODO
  test('sets embedded mount points', () => {
    addMountPoint(data, 'foo', './some-file.json')
    addMountPoint(data, 'foo/bar', './another-file.json')
    expect(data._meta).toEqual({
      [FJSON_DATA_SPACE_KEY]: { "mountSpecs": [{ "dataPath": "foo", "dataFile": "./some-file.json"}] }
    })
    expect(data.foo._meta).toEqual({
      [FJSON_DATA_SPACE_KEY]: { "mountSpecs": [{ "dataPath": "bar", "dataFile": "./another-file.json"}] }
    })
  }) */
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

  test('write single embed', () => {
    const rootTestFile = `${testDir}/single-embed-object.json`
    const barTestFile = `${testDir}/bar.json`
    const testEmbed = { bar : "I'm an embed!" }
    const testData = {
      _meta : { [FJSON_DATA_SPACE_KEY] : { mountSpecs : [{ dataPath : 'foo', dataFile : barTestFile }] } },
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
})
