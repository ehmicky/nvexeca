import { arch as currentArch, cwd as getCwd } from 'process'

import filterObj from 'filter-obj'
import isPlainObj from 'is-plain-obj'
import { validate, multipleValidOptions } from 'jest-validate'

import { validateBasic } from './validate.js'

// Validate input parameters and assign default values.
export const getOpts = function ({ versionRange, command, args, opts }) {
  const { args: argsA, opts: optsA } = parseBasic({ args, opts })

  validateBasic({ versionRange, command, args: argsA, opts: optsA })

  const { dry, progress, fetch, mirror, arch, ...execaOptions } = optsA
  const optsB = { dry, progress, fetch, mirror, arch, cwd: execaOptions.cwd }

  validate(optsB, { exampleConfig: EXAMPLE_OPTS })

  const optsC = filterObj(optsB, isDefined)
  const optsD = { ...DEFAULT_OPTS, ...optsC }

  const { dry: dryA, getNodeOpts } = separateOpts(optsD)
  return { args: argsA, dry: dryA, getNodeOpts, execaOptions }
}

const separateOpts = function ({ dry, progress, fetch, mirror, arch, cwd }) {
  return { dry, getNodeOpts: { progress, fetch, mirror, arch, cwd } }
}

// `args` and `opts` are both optional
const parseBasic = function ({
  args: oArgs,
  opts: oOpts,
  args = [],
  opts = {},
}) {
  if (oOpts === undefined && isPlainObj(oArgs)) {
    return { args: [], opts: oArgs }
  }

  return { args, opts }
}

const isDefined = function (key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  dry: false,
  // Passed to fetch-node-website
  progress: false,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  // Passed to get-node
  arch: currentArch,
  // Passed to normalize-node-version
  cwd: multipleValidOptions(getCwd(), new URL('.', import.meta.url)),
  // Passed to all-node-versions
  fetch: true,
  // Passed to fetch-node-website
  mirror: 'https://nodejs.org/dist',
}
