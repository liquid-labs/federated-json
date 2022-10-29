/**
* Package internal utility functions.
*/
const replaceRE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g

/**
* Replaces constructs like '${FOO}' with the environment value of 'FOO' (or whatever key is used). Will raise an
* exception if no value is found for a given key.
*/
const envTemplateString = (path) => {
  const origPath = path // used for error messages

  let matches // A replaced var may itself reference vars, so we keep processing until everything is resolved.
  while ((matches = [...path.matchAll(replaceRE)]).length > 0) {
    // const matches = [...path.matchAll(replaceRE)]
    matches.reverse() // The reverse allows us to use the start and end indexes without messing up the string.
    for (const matchInfo of matches) {
      const match = matchInfo[0]
      const key = matchInfo[1]
      const value = process.env[key]
      const matchStart = matchInfo.index
      if (value === undefined) {
        throw new Error(`No such environment parameter '${key}' found in path replacement: '${origPath}'.`)
      }
      path = path.substring(0, matchStart) + value + path.substring(matchStart + match.length)
    }
  }

  return path
}

/**
* Returns true if pathA is on pathB. I.e., if pathB is or under pathA. E.g.:
* - ('.', '.foo') => true
* - ('.foo', '.') => false
* - ('.foo', '.foo') => true
*
* Note, this function assumes the paths are valid JSON paths.
*/
const testJsonPaths = (pathA, pathB) => {
  if ((typeof pathA !== 'string' && !(pathA instanceof String))
      || (typeof pathB !== 'string' && !(pathB instanceof String))) {
    throw new Error(`Unexpected non-string input: '${pathA}', '${pathB}'`)
  }
  const pathABits = pathA.split('.')
  const pathBBits = pathB.split('.')
  if (pathABits.length > pathBBits.length) { return false }

  while (pathABits[0] === '') { pathABits.shift() }
  while (pathBBits[0] === '') { pathBBits.shift() }
  if (pathABits.length > pathBBits.length) { return false }

  while (pathABits.length > 0) {
    const aBit = pathABits.shift()
    const bBit = pathBBits.shift()

    if (bBit !== aBit) { return false }
  }

  return true
}

export { envTemplateString, testJsonPaths }
