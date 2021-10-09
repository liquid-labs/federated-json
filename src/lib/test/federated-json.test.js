/* global beforeAll beforeEach describe expect test */

import * as fs from 'fs'
import * as fsPath from 'path'

import { addMountPoint, FJSON_META_DATA_KEY, readFJSON, setSource, writeFJSON } from '../federated-json'

// test constants
const testDir = '/tmp/federated-json.test'

const expectedBaz = 'just a string'

const expectedRootObject = {
  _meta : {
    [FJSON_META_DATA_KEY] : {
      mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
        { path : '.foo.bar', file : '${TEST_DIR}/data/foo-bar.json' }
      ]
    }
  },
  foo : {
    bar : {
      _meta : {
        [FJSON_META_DATA_KEY] : {
          mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
            { path : '.baz', file : '${TEST_DIR}/data/baz.json' }
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
        { linkRefs : '.foo', linkTo : '.source', linkKey : 'name' }
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
    file : '${TEST_DIR}/data/fed-link-source.json',
    path : '.source'
  }]
},
expectedFedLinkArr2Arr._meta[FJSON_META_DATA_KEY])
const expectedScanResult = {
  _meta : {
    'com.liquid-labs.federated-json' : { // eslint-disable-next-line no-template-curly-in-string
      mountSpecs : [{ dir : '${TEST_DIR}/data/datadir', path : '.data' }]
    }
  },
  data : {
    bar : [1, 2, 3],
    baz : { stuff : true },
    foo : 'foo'
  }
}

const testpath = './src/lib/test/data'
const EMPTY_OBJ_SRC = `${testpath}/empty-object.json`
// end test constants
// setup environment for test. Note that 'TEST_DIR' will point to the test-staging, while 'testpath' points to src.
process.env.TEST_DIR = __dirname

describe('addMountPoint', () => {
  let data
  beforeEach(() => { data = { foo : { bar : true }, baz : true } })

  test('sets initial root mount points', () => {
    addMountPoint({ data, path: '.foo', file: './some-file.json' })
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './some-file.json' }] }
    })
  })

  test('sets initial root mount points', () => {
    addMountPoint({ data, path: '.foo', file: './some-file.json' })
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './some-file.json' }] }
    })
  })

  test('updates mount points', () => {
    addMountPoint({ data, path: '.foo', file: './some-file.json' })
    addMountPoint({ data, path: '.foo', file: './another-file.json' })
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './another-file.json' }] }
    })
  })

  test('plays nice with setSource', () => {
    const metaModel = {
      [FJSON_META_DATA_KEY] : { sourceFile : './our-file.json' }
    }
    setSource({ data, file: './our-file.json' })
    expect(data._meta).toEqual(metaModel)

    addMountPoint({ data, path: '.foo', file: './some-file.json' })
    metaModel[FJSON_META_DATA_KEY].mountSpecs = [{ path : '.foo', file : './some-file.json' }]
    expect(data._meta).toEqual(metaModel)

    addMountPoint({ data, path: '.foo', file: './another-file.json' })
    metaModel[FJSON_META_DATA_KEY].mountSpecs = [{ path : '.foo', file : './another-file.json' }]
    expect(data._meta).toEqual(metaModel)
  })

  /* TODO
  test('sets embedded mount points', () => {
    addMountPoint({ data, path: 'foo', file: './some-file.json' })
    addMountPoint({ data, path: 'foo/bar', file: './another-file.json' })
    expect(data._meta).toEqual({
      [FJSON_META_DATA_KEY]: { "mountSpecs": [{ "path": "foo", "file": "./some-file.json"}] }
    })
    expect(data.foo._meta).toEqual({
      [FJSON_META_DATA_KEY]: { "mountSpecs": [{ "path": "bar", "file": "./another-file.json"}] }
    })
  }) */
})

describe('readFJSON', () => {
  test.each`
    description | file | expected
    ${'empty-object.json/trivial object'} | ${EMPTY_OBJ_SRC} | ${{}}
    ${'baz.json/simple string'} | ${testpath + '/baz.json'} | ${expectedBaz}
    ${'root-object.json/federated object'} | ${testpath + '/root-object.json'} | ${expectedRootObject}
    ${'link-arr2arr.json/intra-linked object'} | ${testpath + '/link-arr2arr.json'} | ${expectedArr2Arr}
    ${'link-obj2arr.json/intra-linked object'} | ${testpath + '/link-obj2arr.json'} | ${expectedObj2Arr}
    ${'link-str2arr.json/intra-linked object'} | ${testpath + '/link-str2arr.json'} | ${expectedStr2Arr}
    ${'fed-link-arr2arr.json/fed+linked object'} | ${testpath + '/fed-link-arr2arr.json'} | ${expectedFedLinkArr2Arr}
    ${'data-dir.json/scan-and-load'} | ${testpath + '/data-dir.json'} | ${expectedScanResult}
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
    const badSyntaxFile = `${testpath}/bad-syntax.json`
    expect(() => { readFJSON(badSyntaxFile) }).toThrow(new RegExp(`unexpected token.*${badSyntaxFile}`, 'i'))
  })

  test('throws useful error when no data source specified in mnt spec', () => {
    const badMntSpec = `${testpath}/bad-mnt-spec-no-data-path.json`
    expect(() => { readFJSON(badMntSpec) }).toThrow(/No 'path' specified/)
  })

  test('throws useful error when no data source is empty in mnt spec', () => {
    const badMntSpec = `${testpath}/bad-mnt-spec-empty-data-path.json`
    expect(() => { readFJSON(badMntSpec) }).toThrow(/No 'path' specified/)
  })
})

describe('writeFJSON', () => {
  beforeAll(() => {
    fs.rmSync(testDir, { force: true, recursive : true })
    fs.mkdirSync(testDir)
  })

  test('write {}', () => {
    const testFile = `${testDir}/empty-object.json`
    const testData = {}
    writeFJSON({ data : testData, file : testFile })
    const contents = fs.readFileSync(testFile)
    expect(JSON.parse(contents)).toEqual(testData)
  })

  describe('write single file mount', () => {
    const rootTestFile = `${testDir}/single-mount-file.json`
    const barTestFile = `${testDir}/bar.json`
    const testEmbed = { bar : "I'm an embed!" }
    const testData = {
      _meta : { [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : barTestFile }] } },
      foo   : testEmbed
    }
    beforeAll(() => {
      writeFJSON({ data : testData, file : rootTestFile })
    })

    test('writes truncated root file', () => {
      // the written object should have a 'null' foo
      const exemplar = Object.assign({}, testData)
      exemplar.foo = null
      const rootContents = fs.readFileSync(rootTestFile)
      expect(JSON.parse(rootContents)).toEqual(exemplar)
    })

    test('writes leaf file', () => {
      const barContents = fs.readFileSync(barTestFile)
      expect(JSON.parse(barContents)).toEqual(testEmbed)
    })

    test('leaves source JSON intact', () => {
      expect(testData.foo).toEqual(testEmbed)
    })
  })

  describe('write single dir mount', () => {
    const rootTestFile = `${testDir}/single-mount-dir.json`
    const barTestDir = `${testDir}/bar`
    const barValue = "I'm an embed!"
    const bazValue = [1, 2, 'Hi!']
    const testEmbed = { bar : barValue, baz : bazValue }
    const testData = {
      _meta : { [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', dir : barTestDir }] } },
      foo   : testEmbed
    }
    beforeAll(() => {
      writeFJSON({ data : testData, file : rootTestFile })
    })

    test('writes truncated root file', () => {
      // the written object will have a 'null' foo
      // the written object should have a 'null' foo
      const exemplar = Object.assign({}, testData)
      exemplar.foo = null
      const rootContents = fs.readFileSync(rootTestFile)
      expect(JSON.parse(rootContents)).toEqual(exemplar)
    })

    test('writes leaf files', () => {
      const barContents = fs.readFileSync(`${barTestDir}/bar.json`)
      expect(JSON.parse(barContents)).toEqual(barValue)

      const bazContents = fs.readFileSync(`${barTestDir}/baz.json`)
      expect(JSON.parse(bazContents)).toEqual(bazValue)
    })

    test('leaves source JSON intact', () => {
      expect(testData.foo).toEqual(testEmbed)
    })
  })

  describe('supports partial branch writes', () => {
    const testStagingpath = fsPath.join(__dirname, 'data')

    test('to mounted files', () => {
      // TODO: In theory, it would be better to start form 'expectedRootObject', but we should turn that into a function to isolate instances from cross-pollution
      const file = `${testpath}/root-object.json`
      const data = readFJSON(file, { rememberSource : true })

      const preRootStat = fs.statSync(file, { bigint : true })
      const preFooStat = fs.statSync(`${testStagingpath}/foo-bar.json`, { bigint : true })
      const preBazStat = fs.statSync(`${testStagingpath}/baz.json`, { bigint : true })

      data.foo.bar['another key'] = "I'm a new value!"
      data.foo.bar.baz = ['I am no longer', 'just a string']
      writeFJSON({ data, saveFrom : '.foo' })

      const postRootStat = fs.statSync(file, { bigint : true })
      const postFooStat = fs.statSync(`${testStagingpath}/foo-bar.json`, { bigint : true })
      const postBazStat = fs.statSync(`${testStagingpath}/baz.json`, { bigint : true })

      expect(preRootStat).toEqual(postRootStat)
      expect(preFooStat.mtimeNs).toBeLessThan(postFooStat.mtimeNs)
      expect(preBazStat.mtimeNs).toBeLessThan(postBazStat.mtimeNs)

      const bazContents = fs.readFileSync(`${testStagingpath}/baz.json`)
      expect(JSON.parse(bazContents)).toEqual(data.foo.bar.baz)

      const fooBarContents = fs.readFileSync(`${testStagingpath}/foo-bar.json`)
      data.foo.bar.baz = null
      expect(JSON.parse(fooBarContents)).toEqual(data.foo.bar)
    })

    describe('to mounted directories', () => {
      let file, data, preRootStat
      const preStats = {}
      const loadStats = (target) => {
        for (const subKey of ['foo', 'bar', 'baz']) {
          target[subKey] = fs.statSync(`${testStagingpath}/datadir/${subKey}.json`, { bigint : true })
        }
      }
      beforeAll(() => {
        // TODO: In theory, it would be better to start form 'expectedRootObject', but we should turn that into a function to isolate instances from cross-pollution
        file = `${testpath}/data-dir.json`
        data = readFJSON(file, { rememberSource : true })
        preRootStat = fs.statSync(file, { bigint : true })
      })

      test('update all leaves', () => {
        loadStats(preStats)
        data.data.foo = 'new foo'
        data.data.baz['more stuff'] = 'More stuff'
        data.data.bar.push(4)

        writeFJSON({ data, saveFrom : '.data' })

        const postRootStat = fs.statSync(file, { bigint : true })
        const postStats = {}
        loadStats(postStats)

        expect(preRootStat).toEqual(postRootStat)
        for (const key of Object.keys(preStats)) {
          expect(preStats[key].mtimeNs).toBeLessThan(postStats[key].mtimeNs)
          const leafContents = fs.readFileSync(`${testStagingpath}/datadir/${key}.json`)
          expect(JSON.parse(leafContents)).toEqual(data.data[key])
        }
      })

      test('update one leaf', () => {
        loadStats(preStats)
        data.data.baz['more stuff'] = 'Lots of stuff here'
        writeFJSON({ data, saveFrom : '.data.baz' })

        const postRootStat = fs.statSync(file, { bigint : true })
        const postStats = {}
        loadStats(postStats)

        expect(preRootStat).toEqual(postRootStat)
        for (const key of Object.keys(preStats)) {
          if (key === 'baz') {
            expect(preStats[key].mtimeNs).toBeLessThan(postStats[key].mtimeNs)
          }
          else {
            expect(preStats[key]).toEqual(postStats[key])
          }
          const leafContents = fs.readFileSync(`${testStagingpath}/datadir/${key}.json`)
          expect(JSON.parse(leafContents)).toEqual(data.data[key])
        }
      })
    })
  })

  test('will write to meta source when prsent', () => {
    const testFile = `${testDir}/empty-object.json`
    const testData = {}
    setSource({ data: testData, file: testFile })
    writeFJSON({ data : testData })
    const contents = fs.readFileSync(testFile)
    expect(JSON.parse(contents)).toEqual(testData)
  })

  test('write fails when no target path can be discerned', () => {
    const testData = {}
    expect(() => writeFJSON({ data : testData })).toThrow()
  })
})
