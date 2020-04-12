import execa from 'execa'
import getNode from 'get-node'

import { copyBinaries } from './copy/main.js'
import { getOpts } from './options.js'
import { getCommand, getExecaOptions } from './spawn.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
const nvexeca = async function (versionRange, command, args, opts) {
  const {
    args: argsA,
    opts: { dry, progress, fetch, mirror, arch, cwd },
    execaOptions,
  } = getOpts({ versionRange, command, args, opts })

  const [{ path: nodePath, version }, execaOptionsA] = await Promise.all([
    getNode(versionRange, { progress, fetch, mirror, arch, cwd }),
    copyBinaries(execaOptions),
  ])

  const commandA = getCommand(nodePath, command)
  const execaOptionsB = getExecaOptions(nodePath, execaOptionsA)

  const childProcess = startProcess({
    command: commandA,
    args: argsA,
    execaOptions: execaOptionsB,
    dry,
  })

  return {
    childProcess,
    version,
    versionRange,
    command: commandA,
    args: argsA,
    execaOptions: execaOptionsB,
  }
}

const startProcess = function ({ command, args, execaOptions, dry }) {
  if (dry) {
    return
  }

  return execa(command, args, execaOptions)
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nvexeca
