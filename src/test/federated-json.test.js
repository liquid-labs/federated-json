/* global beforeAll describe expect test */

import * as fs from 'fs'

import { readFJSON, writeFJSON } from '../federated-json'

const testDir = '/tmp/federated-json.test'

describe('readFJSON', () => {
  test('loads {}', () => {
    const data = readFJSON('./src/test/empty-object.json')
    expect(data).toEqual({})
  })
})

describe('writeFJSON', () => {
  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir)
    }
  })

  test('write {}', () => {
    const testFile = `${testDir}/empty-object.json`
    writeFJSON(testFile, {})
    const contents = fs.readFileSync(testFile)
    expect(contents.toString()).toEqual('{}')
  })
})
