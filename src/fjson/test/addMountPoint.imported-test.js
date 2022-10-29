/* global beforeEach describe expect test */

import { addMountPoint, FJSON_META_DATA_KEY, setSource } from '../federated-json'

const addMountPointTests = () => {
  describe('addMountPoint', () => {
    let data
    beforeEach(() => { data = { foo : { bar : true }, baz : true } })

    test('sets initial root mount points', () => {
      addMountPoint({ data, path : '.foo', file : './some-file.json' })
      expect(data._meta).toEqual({
        [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './some-file.json' }] }
      })
    })

    test('sets initial root mount points', () => {
      addMountPoint({ data, path : '.foo', file : './some-file.json' })
      expect(data._meta).toEqual({
        [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './some-file.json' }] }
      })
    })

    test('updates mount points', () => {
      addMountPoint({ data, path : '.foo', file : './some-file.json' })
      addMountPoint({ data, path : '.foo', file : './another-file.json' })
      expect(data._meta).toEqual({
        [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : './another-file.json' }] }
      })
    })

    test('plays nice with setSource', () => {
      const metaModel = {
        [FJSON_META_DATA_KEY] : { sourceFile : './our-file.json' }
      }
      setSource({ data, file : './our-file.json' })
      expect(data._meta).toEqual(metaModel)

      addMountPoint({ data, path : '.foo', file : './some-file.json' })
      metaModel[FJSON_META_DATA_KEY].mountSpecs = [{ path : '.foo', file : './some-file.json' }]
      expect(data._meta).toEqual(metaModel)

      addMountPoint({ data, path : '.foo', file : './another-file.json' })
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
}

export { addMountPointTests }
