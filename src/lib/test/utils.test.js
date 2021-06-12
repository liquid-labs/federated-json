/* global describe expect test */
/* eslint-disable no-template-curly-in-string */ // our replacement strings look like templates, but they are not.

import { envTemplateString, testJsonPaths } from '../utils'

describe('envTemplateString', () => {
  test.each`
    path | expected
    ${'/foo/bar/no-replacement.json'} | ${'/foo/bar/no-replacement.json'}
    ${'${HOME}/data.json'} | ${`${process.env.HOME}/data.json`}
    ${'${HOME}/${PWD}/data.json'} | ${`${process.env.HOME}/${process.env.PWD}/data.json`}
    `('$path => $expected', ({ path, expected }) => {
    expect(envTemplateString(path)).toEqual(expected)
  })

  test('throws useful error when replacement fails', () => {
    const badKey = 'BLAHBLAHBLAH'
    const origPath = `\${${badKey}}/data.json`
    expect(() => envTemplateString(origPath)).toThrow(new RegExp(`.'${badKey}'.*'\\${origPath}'`))
  })
})

describe('testJsonPaths', () => {
  test.each`
    pathA | pathB | result
    ${'.'} | ${'.'} | ${true}
    ${'.'} | ${'.foo'} | ${true}
    ${'.foo'} | ${'.'} | ${false}
    ${'.foo.bar'} | ${'.'} | ${false}
    ${'.foo'} | ${'.foo'} | ${true}
    ${'.foo'} | ${'.foo.bar'} | ${true}
    ${'.foo'} | ${'.bar'} | ${false}
    `("Path '$pathA' on path '$pathB' => result", ({ pathA, pathB, result }) => {
    expect(testJsonPaths(pathA, pathB)).toBe(result)
  })

  test.each`
    pathA | pathB
    ${1} | ${'.'}
    ${'.'} | ${1}
    ${'.'} | ${null}
    ${'.'} | ${undefined}
    ${'.'} | ${{}}
    ${'.'} | ${[]}
    `("Inputs '$pathA' '$pathB' raise an exception", ({ pathA, pathB }) => {
    expect(() => testJsonPaths(pathA, pathB)) // eslint-disable-next-line no-useless-escape
      .toThrow(new RegExp(`non-string input.*${pathA === '.' ? '\.' : pathA}.*${pathB === '.' ? '\.' : pathB}`))
  })
})
