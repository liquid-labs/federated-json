/* global describe expect test */
/* eslint-disable no-template-curly-in-string */ // our replacement strings look like templates, but they are not.

import { envTemplateString } from '../utils'

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
