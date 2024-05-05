import { execa } from 'execa'
import getNode from 'get-node'

import { copyBinaries } from './copy/main.js'
import { getOpts } from './options.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
const nvexeca = async (versionRange, command, args, opts) => {
  const {
    args: argsA,
    dry,
    getNodeOpts,
    execaOptions,
  } = getOpts({ versionRange, command, args, opts })

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

export default nvexeca

// Some libraries like `spawn-wrap` monkey patch `child_process.spawn()` to
// modify `$PATH` and prepend their own `node` wrapper. We fix it by using the
// `node` absolute path instead of relying on `$PATH`.
// Note that this does not work:
//  - with nested child processes
//  - with binaries
// This is also slightly faster as it does not require any `$PATH` lookup.
const getCommand = (nodePath, command) =>
  command === 'node' ? nodePath : command

// Forward arguments to another node binary located at `nodePath`.
// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `execa` `nodePath` for this.
const getExecaOptions = (nodePath, execaOptions) => ({
  ...execaOptions,
  nodePath,
  preferLocal: true,
})

// `signal` cancels downloading the Node.js binary, but not the command
// execution. This allows `nve --parallel` to execute both failing and
// successful commands. However, non-command related failures (like Node.js
// binary download issue) aborts everything.
const startProcess = ({ command, args, execaOptions, dry }) => {
  if (dry) {
    return
  }

  return execa(command, args, execaOptions)
}
