import { platform } from 'process'

import { npm } from 'global-dirs'

export const getCommand = function(command, nodePath, { shell }) {
  // The following is not relevant in shell mode:
  //  - shell spawning creates a nested child process
  //  - `file.cmd` is not necessary when run through `cmd.exe`
  if (shell) {
    return command
  }

  // Some libraries like `spawn-wrap` (used by `nyc`) monkey patch
  // `child_process.spawn()` to modify `$PATH` and prepend their own `node`
  // wrapper. We fix it by using the `node` absolute path instead of relying on
  // `$PATH`. Note that this does not work:
  //  - with nested child processes
  //  - with binaries
  // This is also slightly faster as it does not require any `$PATH` lookup.
  if (command === 'node') {
    return nodePath
  }

  // On Windows, global binaries (except `node` itself) have two files:
  //   - `file`: a Node.js file which is not executable (but can be run with
  //     `node`)
  //   - `file.cmd`: the actual executable file
  if (platform === 'win32') {
    return `${command}.cmd`
  }

  return command
}

// Forward arguments to another node binary located at `nodePath`.
// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `execa` `execPath` for this.
// This option requires `preferLocal: true`
export const getExecaOptions = function(
  command,
  nodePath,
  { env, ...execaOptions },
) {
  const envA = addPrefix(env)
  return { ...execaOptions, env: envA, execPath: nodePath, preferLocal: true }
}

// npm, yarn and similar tools rely on the assumption that process.execPath
// is located in the same place as global binaries. This is not the case with
// nve so we need to override that logic by specifying the NPM_CONFIG_PREFIX
// environment variable which is used by those tools for that purpose.
// We use that variable since it has lower priority than yarn configuration
// files (unlike PREFIX).
// We use `global-dirs` which provides the best value for `NPM_CONFIG_PREFIX`
// since it takes into account npmrc, npm_config_prefix, environment variables,
// etc.
export const addPrefix = function(env) {
  return { NPM_CONFIG_PREFIX: npm.prefix, ...env }
}
