const testpath = './fjson/test/data'

const EMPTY_OBJ_SRC = `${testpath}/empty-object.json`

// test constants
const testDir = '/tmp/federated-json.test'

// setup environment for test. Note that 'TEST_DIR' will point to the test-staging, while 'testpath' points to src.
process.env.TEST_DIR = __dirname

export { EMPTY_OBJ_SRC, testpath, testDir }
