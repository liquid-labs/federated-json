/* global beforeAll describe expect test */
import fs from 'node:fs/promises'

import structuredClone from 'core-js-pure/actual/structured-clone'

import { lastModificationMs, readFJSON, FJSON_META_DATA_KEY } from '../federated-json'
import { EMPTY_OBJ_SRC, testpath } from './shared-test-data'

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

const expectedRootObjectYamlSub = structuredClone(expectedRootObject)
// eslint-disable-next-line no-template-curly-in-string
expectedRootObjectYamlSub._meta[FJSON_META_DATA_KEY].mountSpecs[0].file = '${TEST_DIR}/data/foo-bar.yaml'

const expectedRootObjectRel = {
  _meta : {
    [FJSON_META_DATA_KEY] : {
      mountSpecs : [ // eslint-disable-next-line no-template-curly-in-string
        { path : '.foo.bar', file : './foo-bar.json' }
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

// slight rename since we use 'foo.bar.baz', but without mount points (matters for the meta-separate tests)
const linkyBase2 = {
  _meta : {
    [FJSON_META_DATA_KEY] : {
      linkSpecs : [
        { linkRefs : '.foo2', linkTo : '.source', linkKey : 'name' }
      ]
    }
  },
  source : [linkyBarRef, linkyBazRef]
}

const expectedArr2Arr = Object.assign({ foo : [linkyBarRef, linkyBazRef] }, linkyBase)
const expectedObj2Arr = Object.assign({ foo2 : { bar : linkyBarRef, baz : linkyBazRef } }, linkyBase2)
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

const expectedDataDir = {
  bar : [1, 2, 3],
  baz : { stuff : true },
  foo : 'foo'
}

const expectedScanResult = {
  _meta : {
    'com.liquid-labs.federated-json' : { // eslint-disable-next-line no-template-curly-in-string
      mountSpecs : [{ dir : '${TEST_DIR}/data/datadir', path : '.data' }]
    }
  },
  data : expectedDataDir
}

const mkEntry = (description, file, expected) => ({
  description,
  file,
  expected
})

const readTable = [
  mkEntry('empty-object.json/trivial object', EMPTY_OBJ_SRC, {}),
  mkEntry('baz.json/simple string', testpath + '/baz.json', expectedBaz),
  mkEntry('root-object.json/federated object', testpath + '/root-object.json', expectedRootObject),
  mkEntry('root-object.yaml/federated object', testpath + '/root-object.yaml', expectedRootObject),
  mkEntry('root-object-yaml-sub.json/federated object', testpath + '/root-object-yaml-sub.json', expectedRootObjectYamlSub),
  mkEntry('root-object-rel.json/federated object', testpath + '/root-object-rel.json', expectedRootObjectRel),
  mkEntry('link-arr2arr.json/intra-linked object', testpath + '/link-arr2arr.json', expectedArr2Arr),
  mkEntry('link-obj2arr.json/intra-linked object', testpath + '/link-obj2arr.json', expectedObj2Arr),
  mkEntry('link-str2arr.json/intra-linked object', testpath + '/link-str2arr.json', expectedStr2Arr),
  mkEntry('fed-link-arr2arr.json/fed+linked object', testpath + '/fed-link-arr2arr.json', expectedFedLinkArr2Arr),
  mkEntry('data-dir.json/scan-and-load', testpath + '/data-dir.json', expectedScanResult)
]

const readFJSONTests = () => {
  describe('readFJSON', () => {
    test('raises an exception when second argument is not an object', () => 
      expect(() => readFJSON('foo.json', 'bad argument')).toThrow())

    test('raises an exception when there are arguments following an initial parameter object', () =>
      expect(() => readFJSON({ file: 'foo.json' }, 'bad argument')).toThrow())

    test.each(readTable)('loads $description', ({ file, expected }) => {
      const data = readFJSON(file, { noMtime : true })
      expect(data).toEqual(expected)
    })

    test.each(readTable)('loads $description with separate meta', ({ file, expected }) => {
      const [data, meta] = readFJSON({ file, noMtime : true, separateMeta : true })
      const noMetaExpected = structuredClone(expected)
      const rootMeta = noMetaExpected._meta
      delete noMetaExpected._meta
      // this is a little hacky, but good enough for now...
      if (noMetaExpected?.foo?.bar) {
        const barMeta = noMetaExpected.foo.bar._meta
        expect(barMeta).toEqual(meta.foo.bar._meta)
        noMetaExpected.foo.bar = Object.assign({}, noMetaExpected.foo.bar)
        delete noMetaExpected.foo.bar._meta
      }
      expect(data).toEqual(noMetaExpected)
      expect(rootMeta).toEqual(meta._meta)
    })

    test('can remember the source', () => {
      const data = readFJSON(EMPTY_OBJ_SRC, { noMtime : true, rememberSource : true })
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
      expect(() => { readFJSON(badFileName) }).toThrow(new RegExp(`'${processedFileName}'`))
    })

    test('throws useful error when JSON syntax is bad.', () => {
      const badSyntaxFile = `${testpath}/bad-syntax.json`
      expect(() => { readFJSON(badSyntaxFile) }).toThrow(new RegExp(`${badSyntaxFile}`))
    })

    test('throws useful error when no data source specified in mnt spec', () => {
      const badMntSpec = `${testpath}/bad-mnt-spec-no-data-path.json`
      expect(() => { readFJSON(badMntSpec) }).toThrow(/No 'path' specified/)
    })

    test('throws useful error when no data source is empty in mnt spec', () => {
      const badMntSpec = `${testpath}/bad-mnt-spec-empty-data-path.json`
      expect(() => { readFJSON(badMntSpec) }).toThrow(/No 'path' specified/)
    })

    describe('createOnNone = {}', () => {
      let data
      const createOnNoneFile = __dirname + '/createOnNoneA.json'
      const initialData = { a: 1 }
      beforeAll(() => {
        data = readFJSON({ file: createOnNoneFile, createOnNone: initialData })
      })

      test('returns the initialized data', () => {
        const cloneData = structuredClone(data)
        delete cloneData._meta
        expect(cloneData).toEqual(initialData)
      })

      test('creates the file with the initial data string', async () => {
        const fileData = JSON.parse(await fs.readFile(createOnNoneFile))
        expect(fileData).toEqual(initialData)
      })
    })

    describe('overrides', () => {
      test("can replace a 'dir' with a 'file'", () =>
        expect(readFJSON(testpath + '/data-dir.json',
          // eslint-disable-next-line no-template-curly-in-string
          { overrides : { '.data' : 'file:${TEST_DIR}/data/baz.json' } }).data)
          .toEqual('just a string'))

      test("can replace a 'file' with a 'dir'", () =>
        expect(readFJSON(testpath + '/foo-bar.json',
          {
            noMtime   : true,
            // eslint-disable-next-line no-template-curly-in-string
            overrides : { '.baz' : 'dir:${TEST_DIR}/data/datadir' }
          }).baz)
          .toEqual(expectedDataDir))

      test('will throw when missing the type indicator', () =>
        expect(() => readFJSON(testpath + '/data-dir.json',
          { overrides : { '.data' : `${testpath}/baz.json` } })).toThrow())
    })

    describe('lastModificationMs', () => {
      test('works with sub-file reads', () => {
        const data = readFJSON(testpath + '/foo-bar.json')
        expect(lastModificationMs(data)).toBeTruthy()
      })

      test('works with directory reads', () => {
        const data = readFJSON(testpath + '/data-dir.json')
        expect(lastModificationMs(data)).toBeTruthy()
      })
    })
  })
}

export { readFJSONTests }
