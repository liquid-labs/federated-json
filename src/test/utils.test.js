import { processPath } from '../utils'

describe('processPath', () => {
  test.each`
    path | expected
    ${'/foo/bar/no-replacement.json'} | ${'/foo/bar/no-replacement.json'}
    ${`\${HOME}/data.json`} | ${`${process.env.HOME}/data.json`}
    ${`\${HOME}/\${PWD}/data.json`} | ${`${process.env.HOME}/${process.env.PWD}/data.json`}
    `('$path => $expected', ({ path, expected }) => {
    expect(processPath(path)).toEqual(expected)
  })
})
