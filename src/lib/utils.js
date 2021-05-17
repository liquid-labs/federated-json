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

export { envTemplateString }
