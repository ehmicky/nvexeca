import execa from 'execa'
import getNode from 'get-node'

import { copyBinaries } from './copy/main.js'
import { getOpts } from './options.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
export default async function nvexeca(versionRange, command, args, opts) {
  const {
    args: argsA,
    dry,
    getNodeOpts,
    execaOptions,
  } = getOpts({
    versionRange,
    command,
    args,
    opts,
  })

  const [{ path: nodePath, version }, execaOptionsA] = await Promise.all([
    getNode(versionRange, getNodeOpts),
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

// Some libraries like `spawn-wrap` monkey patch `child_process.spawn()` to
// modify `$PATH` and prepend their own `node` wrapper. We fix it by using the
// `node` absolute path instead of relying on `$PATH`.
// Note that this does not work:
//  - with nested child processes
//  - with binaries
// This is also slightly faster as it does not require any `$PATH` lookup.
const getCommand = function (nodePath, command) {
  return command === 'node' ? nodePath : command
}

// Forward arguments to another node binary located at `nodePath`.
// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `execa` `execPath` for this.
// This option requires `preferLocal: true`
const getExecaOptions = function (nodePath, execaOptions) {
  return { ...execaOptions, execPath: nodePath, preferLocal: true }
}

const startProcess = function ({ command, args, execaOptions, dry }) {
  if (dry) {
    return
  }

  return execa(command, args, execaOptions)
}
