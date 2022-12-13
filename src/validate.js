import isPlainObj from 'is-plain-obj'

// Validate input parameters
export const validateBasic = ({ versionRange, command, args, opts }) => {
  validateRange(versionRange)

  if (typeof command !== 'string') {
    throw new TypeError(`Second argument must be a command: ${command}`)
  }

  if (!isStringArray(args)) {
    throw new TypeError(`Third argument must be an array of strings: ${args}`)
  }

  if (!isPlainObj(opts)) {
    throw new TypeError(`Last argument must be an options object: ${opts}`)
  }
}

const validateRange = (versionRange) => {
  if (typeof versionRange !== 'string') {
    throw new TypeError(`Invalid version: ${versionRange}`)
  }
}

const isStringArray = (args) => Array.isArray(args) && args.every(isString)

const isString = (arg) => typeof arg === 'string'
