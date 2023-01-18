/* global beforeAll beforeEach describe expect test */
import * as fs from 'node:fs'
import * as fsPath from 'node:path'

import yaml from 'js-yaml'

import { readFJSON, writeFJSON, FJSON_META_DATA_KEY, setSource } from '../federated-json'
// testDir is a /tmp path and writable as is
import { testDir, testpath } from './shared-test-data'

const writeFJSONTests = () => {
  describe('writeFJSON', () => {
    beforeAll(() => {
      fs.rmSync(testDir, { force : true, recursive : true })
      fs.mkdirSync(testDir)
    })

    test('write {}', () => {
      const testFile = `${testDir}/empty-object.json`
      const testData = {}
      writeFJSON({ data : testData, file : testFile })
      const contents = fs.readFileSync(testFile)
      expect(JSON.parse(contents)).toEqual(testData)
    })

    test('raises exception when no file discernable', () => {
      expect(() => writeFJSON({ data : {} })).toThrow(/No explicit file/)
    })

    describe('write single file mount', () => {
      const testEmbed = { bar : "I'm an embed!" }

      const absoluteMountFileMatrix = [
        [ `${testDir}/single-mount-file-abs.json`, `${testDir}/bar-abs.json` ],
        [ `${testDir}/single-mount-file-abs.yaml`, `${testDir}/bar-abs.json` ],
        [ `${testDir}/single-mount-file-abs.json`, `${testDir}/bar-abs.yaml` ],
        [ `${testDir}/single-mount-file-abs.yaml`, `${testDir}/bar-abs.yaml` ]
      ]
      for (const [ rootTestFile, barTestFile ] of absoluteMountFileMatrix) {
        describe('absolute mount spec', () => {
          const rootTestFile = `${testDir}/single-mount-file-abs.json`
          const barTestFile = `${testDir}/bar-abs.json`
          const testData = {
            _meta : { [FJSON_META_DATA_KEY] : { mountSpecs : [{ path : '.foo', file : barTestFile }] } },
            foo   : testEmbed
          }
          let rootFileContents
          beforeAll(() => {
            writeFJSON({ data : testData, file : rootTestFile })
            rootFileContents = fs.readFileSync(rootTestFile, { encoding : 'utf8' })
          })

          test('writes truncated root file', () => {
            // the written object should have a 'null' foo
            const exemplar = Object.assign({}, testData)
            exemplar.foo = null
            expect(JSON.parse(rootFileContents)).toEqual(exemplar)
          })

          test('writes leaf file', () => {
            const barContents = fs.readFileSync(barTestFile)
            expect(JSON.parse(barContents)).toEqual(testEmbed)
          })

          test('leaves source JSON intact', () => {
            expect(testData.foo).toEqual(testEmbed)
          })

          test('file ends with blank newline', () => {
            expect(rootFileContents.endsWith('\n'))
          })
        })
      }

      describe('relative mount spec', () => {
        const rootTestFile = `${testDir}/single-mount-file-rel.json`
        const barTestFile = './bar-rel.json'
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
          const barContents = fs.readFileSync(fsPath.resolve(testDir, barTestFile))
          expect(JSON.parse(barContents)).toEqual(testEmbed)
        })

        test('leaves source JSON intact', () => {
          expect(testData.foo).toEqual(testEmbed)
        })
      })
    })

    for (const rootTestFile of [ `${testDir}/single-mount-dir.json`, `${testDir}/single-mount-dir.yaml` ]) {
      describe('write single dir mount', () => {
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
          const expectedData = rootTestFile.endsWith('.json') ? JSON.parse(rootContents) : yaml.load(rootContents)
          expect(expectedData).toEqual(exemplar)
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
    }

    describe('supports partial branch writes', () => {
      const testStagingpath = fsPath.join(__dirname, 'data')

      test('to mounted files', () => {
        // TODO: In theory, it would be better to start form 'expectedRootObject', but we should turn that into a function to isolate instances from cross-pollution
        const roFile = `${testpath}/root-object.json`
        const data = readFJSON(roFile, { rememberSource : true })

        const preRootStat = fs.statSync(roFile, { bigint : true })
        const preFooStat = fs.statSync(`${testStagingpath}/foo-bar.json`, { bigint : true })
        const preBazStat = fs.statSync(`${testStagingpath}/baz.json`, { bigint : true })

        data.foo.bar['another key'] = "I'm a new value!"
        data.foo.bar.baz = ['I am no longer', 'just a string']
        writeFJSON({ data, saveFrom : '.foo' })

        const postRootStat = fs.statSync(roFile, { bigint : true })
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
        const ddFile = `${testpath}/data-dir.json`
        let data, preRootStat, postRootStat
        const postStats = {}
        const preStats = {}
        const loadStats = (target) => {
          for (const subKey of ['foo', 'bar', 'baz']) {
            target[subKey] = fs.statSync(`${testStagingpath}/datadir/${subKey}.json`, { bigint : true })
          }
        }
        beforeAll(() => {
          // TODO: In theory, it would be better to start form 'expectedRootObject', but we should turn that into a function to isolate instances from cross-pollution
          // need to set 'rememberSource' so the sub-data will get read with source attached.
          data = readFJSON(ddFile, { rememberSource : true })
          preRootStat = fs.statSync(ddFile, { bigint : true })

          loadStats(preStats)
          data.data.foo = 'new foo'
          data.data.baz['more stuff'] = 'More stuff'
          data.data.bar.push(4)

          writeFJSON({ data, leaveInternalMeta : true, saveFrom : '.data' })

          postRootStat = fs.statSync(ddFile, { bigint : true })
          loadStats(postStats)
        })

        test('does not update root', () => {
          expect(preRootStat).toEqual(postRootStat)
        })

        test.each([
          ['bar'], // an array
          ['baz'], // an object literal
          ['foo'] // a string
        ], ("file for '%s' has been updated", (key) => {
          expect(preStats[key].mtimeNs).toBeLessThan(postStats[key].mtimeNs)
        }))

        test.each([
          ['bar', undefined], // an array
          ['baz', `${testStagingpath}/datadir/baz.json`], // an object literal
          ['foo', undefined] // a string
        ])("'leaveInternalMeta' retains in memory meta-source for '%s' and source file is '%s'", (key, source) => {
          const leafInMemory = data.data[key]
          expect(leafInMemory?._meta?.[FJSON_META_DATA_KEY]?.sourceFile).toBe(source)
        })

        test("the on-disk file for 'baz' remembers the source", () => {
          const source = `${testStagingpath}/datadir/baz.json`
          const leafContentsOnDisk = fs.readFileSync(source, { encoding : 'utf8' })
          const leafOnDisk = JSON.parse(leafContentsOnDisk)
          expect(leafOnDisk?._meta?.[FJSON_META_DATA_KEY]?.sourceFile).toBe(source)
        })

        // in the case of the 'bar' array, the in-memory object has a non-iterable _meta field, but this gets lost when //
        // it's written to disk.
        // for the string 'foo', there's no source attached in the first place and testing is pointless because you can't
        // attach anything to a string. It would blow up if the main program tried.

        describe('for just one (directory) leaf', () => {
          // create new vars for the pre/post (covering the vars in the outer describe)
          let preRootStat, postRootStat // leave file and data alone
          const postStats = {}
          const preStats = {}
          beforeEach(() => {
            preRootStat = fs.statSync(ddFile, { bigint : true })
            loadStats(preStats)
            data.data.baz['more stuff'] = 'Lots of stuff here'
            writeFJSON({ data, saveFrom : '.data.baz' })

            postRootStat = fs.statSync(ddFile, { bigint : true })
            loadStats(postStats)
          })

          test('does not update root', () => {
            expect(preRootStat).toEqual(postRootStat)
          })

          test.each([
            ['bar', false],
            ['baz', true],
            ['foo', false]]
          )("'%s' file is updated: %s", (key, updated) => {
            if (updated) {
              expect(preStats[key].mtimeNs).toBeLessThan(postStats[key].mtimeNs)
            }
            else {
              expect(preStats[key]).toEqual(postStats[key])
            }
            const leafContents = fs.readFileSync(`${testStagingpath}/datadir/${key}.json`)
            let leafData = data.data[key]
            if (Array.isArray(leafData)) {
              // because there is an attached '.sourceFile'
              leafData = [...leafData]
            }
            expect(JSON.parse(leafContents)).toEqual(leafData)
          })
        })
      })
    })

    test('will write to meta source when persent', () => {
      const testFile = `${testDir}/empty-object.json`
      const testData = {}
      setSource({ data : testData, file : testFile })
      writeFJSON({ data : testData })
      const contents = fs.readFileSync(testFile)
      expect(JSON.parse(contents)).toEqual(testData)
    })

    test('write fails when no target path can be discerned', () => {
      const testData = {}
      expect(() => writeFJSON({ data : testData })).toThrow()
    })
  })
}

export { writeFJSONTests }
