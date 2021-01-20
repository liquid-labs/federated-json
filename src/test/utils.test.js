import { processPath } from '../utils'

describe('processPath', () => {
  const testPlayground = '/liq/playground'
  beforeAll(() => { process.env.LIQ_PLAYGROUND = testPlayground })
  test.each`
    path | expected
    ${'/foo/bar/no-replacement.json'} | ${'/foo/bar/no-replacement.json'}
    ${`\${LIQ_PLAYGROUND}/data.json`} | ${`${testPlayground}/data.json`}
    `('$path => $expected', ({ path, expected }) => {
    expect(processPath(path)).toEqual(expected)
  })
})
