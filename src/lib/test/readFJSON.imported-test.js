/* global beforeEach describe expect test */

import { readFJSON, FJSON_META_DATA_KEY } from '../federated-json'
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

const readFJSONTests = () => {
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
}

export { readFJSONTests }
