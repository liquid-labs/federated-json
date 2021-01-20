/**
* Package internal utility functions.
*/
const replaceRE = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g

/**
* Replaces constructs like '${FOO}' with the environment value of 'FOO' (or whatever key is used). Will raise an
* exception if no value is found for a given key.
*/
const processPath = (path) => {
  const matches = [...path.matchAll(replaceRE)]
  matches.reverse() // The reverse allows us to use the start and end indexes without messing up the string.
  for (const matchInfo of matches) {
    const match = matchInfo[0]
    const key = matchInfo[1]
    const value = process.env[key]
    const matchStart = matchInfo.index
    if (value === undefined) {
      throw new Error(`Could not process path replacement for '${key}'; no such environment parameter found.`)
    }
    path = path.substring(0, matchStart) + value + path.substring(matchStart + match.length)
  }

  return path
}

export { processPath }
