/* global beforeEach describe expect test */
import * as fs from 'fs'
import * as fsPath from 'path'

import { readFJSON, writeFJSON, FJSON_META_DATA_KEY, setSource } from '../federated-json'
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
        let file, data, preRootStat, postRootStat
        const postStats = {}
        const preStats = {}
        const loadStats = (target) => {
          for (const subKey of ['foo', 'bar', 'baz']) {
            target[subKey] = fs.statSync(`${testStagingpath}/datadir/${subKey}.json`, { bigint : true })
          }
        }
        beforeAll(() => {
          // TODO: In theory, it would be better to start form 'expectedRootObject', but we should turn that into a function to isolate instances from cross-pollution
          file = `${testpath}/data-dir.json`
          // need to set 'rememberSource' so the sub-data will get read with source attached.
          data = readFJSON(file, { rememberSource : true })
          preRootStat = fs.statSync(file, { bigint : true })

          loadStats(preStats)
          data.data.foo = 'new foo'
          data.data.baz['more stuff'] = 'More stuff'
          data.data.bar.push(4)

          writeFJSON({ data, saveFrom : '.data' })

          postRootStat = fs.statSync(file, { bigint : true })
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
        ])("in memory meta-source for '%s' is '%s'", (key, source) => {
          const leafContentsOnDisk = fs.readFileSync(`${testStagingpath}/datadir/${key}.json`, { encoding : 'utf8' })
          const leafOnDisk = JSON.parse(leafContentsOnDisk)
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
          beforeAll(() => {
            preRootStat = fs.statSync(file, { bigint : true })
            loadStats(preStats)
            data.data.baz['more stuff'] = 'Lots of stuff here'
            writeFJSON({ data, saveFrom : '.data.baz' })

            postRootStat = fs.statSync(file, { bigint : true })
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
            expect(JSON.parse(leafContents)).toEqual(data.data[key])
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
