import isPlainObj from 'is-plain-obj'

import { validateBasic } from './validate.js'

// Validate input parameters and assign default values.
export const getOpts = ({ versionRange, command, args, opts }) => {
  const { args: argsA, opts: optsA } = parseBasic({ args, opts })

  validateBasic({ versionRange, command, args: argsA, opts: optsA })

  const {
    dry = false,
    progress,
    fetch: fetchOpt,
    mirror,
    arch,
    ...execaOptions
  } = optsA
  const getNodeOpts = {
    progress,
    fetch: fetchOpt,
    mirror,
    arch,
    signal: execaOptions.signal,
    cwd: execaOptions.cwd,
  }

  if (typeof dry !== 'boolean') {
    throw new TypeError(`Option "dry" must be a boolean: ${dry}`)
  }

  return { args: argsA, dry, getNodeOpts, execaOptions }
}

// `args` and `opts` are both optional
const parseBasic = ({ args: oArgs, opts: oOpts, args = [], opts = {} }) =>
  oOpts === undefined && isPlainObj(oArgs)
    ? { args: [], opts: oArgs }
    : { args, opts }
