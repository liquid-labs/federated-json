/* global beforeAll beforeEach describe expect test */
import { addMountPointTests } from './addMountPoint.imported-test'
import { readFJSONTests } from './readFJSON.imported-test'
import { writeFJSONTests } from './writeFJSON.imported-test'

describe('federated-json', () => {
  addMountPointTests()
  
  readFJSONTests()
  
  writeFJSONTests()
})
