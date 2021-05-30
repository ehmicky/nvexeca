// Some libraries like `spawn-wrap` monkey patch `child_process.spawn()` to
// modify `$PATH` and prepend their own `node` wrapper. We fix it by using the
// `node` absolute path instead of relying on `$PATH`.
// Note that this does not work:
//  - with nested child processes
//  - with binaries
// This is also slightly faster as it does not require any `$PATH` lookup.
export const getCommand = function (nodePath, command) {
  return command === 'node' ? nodePath : command
}

// Forward arguments to another node binary located at `nodePath`.
// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `execa` `execPath` for this.
// This option requires `preferLocal: true`
export const getExecaOptions = function (nodePath, execaOptions) {
  return { ...execaOptions, execPath: nodePath, preferLocal: true }
}
