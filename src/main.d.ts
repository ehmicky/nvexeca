import type { ResultPromise, Options as ExecaOptions } from 'execa'
import type { Options as GetNodeOptions, SemverVersion } from 'get-node'

export interface ProcessInfo {
  /**
   * [`childProcess` instance](https://nodejs.org/api/child_process.html#child_process_class_childprocess).
   * It is also a `Promise` resolving or rejecting with a
   * [`Result`](https://github.com/sindresorhus/execa/blob/main/docs/api.md#result).
   * The `Promise` should be awaited if you want to wait for the process to
   * complete.
   * This is `undefined` when the `dry` option is `true`.
   */
  childProcess?: ResultPromise

  /**
   * Node.js version passed as input, such as `"v10"`.
   */
  versionRange: string

  /**
   * Normalized Node.js version
   * For example if `"v10"` was passed as input, `version` will be `"10.17.0"`.
   */
  version: SemverVersion

  /**
   * File or command that was executed.
   */
  command: string

  /**
   * Arguments that were passed to the `command`.
   */
  args: string[]

  /**
   * [Options](https://github.com/sindresorhus/execa/blob/main/docs/api.md#options)
   * that were passed to [Execa](https://github.com/sindresorhus/execa).
   */
  execaOptions: ExecaOptions
}

/**
 * All Execa options are available. Please refer to Execa for the list of
 * [possible options](https://github.com/sindresorhus/execa/blob/main/docs/api.md#options).
 * The
 * [`preferLocal` option](https://github.com/sindresorhus/execa/blob/main/docs/api.md#optionspreferlocal)
 * is always `true`.
 */
export type Options =
  | ExecaOptions
  | Partial<{
      /**
       * Do not execute the command.
       * This can be used to cache the initial Node.js binary download.
       *
       * @default false
       */
      dry: boolean

      /**
       * Whether to show a progress bar.
       *
       * @default false
       */
      progress: GetNodeOptions['progress']

      /**
       * Base URL to retrieve Node.js binaries.
       * Can be customized (for example `https://npmmirror.com/mirrors/node`).
       * The following environment variables can also be used: `NODE_MIRROR`,
       * `NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.
       *
       * @default "https://nodejs.org/dist"
       */
      mirror: GetNodeOptions['mirror']

      /**
       * The list of available Node.js versions is cached for one hour by default.
       * If the `fetch` option is:
       *  - `true`: the cache will not be used
       *  - `false`: the cache will be used even if it's older than one hour
       *
       * @default undefined
       */
      fetch: GetNodeOptions['fetch']

      /**
       * Node.js binary's CPU architecture. This is useful for example when you're
       * on x64 but would like to run Node.js x32.
       * All the values from
       * [`process.arch`](https://nodejs.org/api/process.html#process_process_arch)
       * are allowed except `mips` and `mipsel`.
       *
       * @default `process.arch`
       */
      arch: GetNodeOptions['arch']

      /**
       * Current working directory of the child process.
       * When using the `local` alias, start looking for a Node.js version file
       * from this directory.
       *
       * @default "."
       */
      cwd: GetNodeOptions['cwd']
    }>

/**
 * Executes `command ...args` with a specific Node.js `versionRange`.
 *
 * @example
 * ```js
 * const { childProcess, versionRange, version } = await nvexeca('8', 'node', [
 *   '--version',
 * ])
 * console.log(`Node ${versionRange} (${version})`) // Node 8 (8.16.2)
 * const { exitCode, stdout, stderr } = await childProcess
 * console.log(`Exit code: ${exitCode}`) // 0
 * console.log(stdout) // v8.16.2
 * ```
 */
export default function nvexeca(
  /**
   * This can be:
   *  - any [version range](https://github.com/npm/node-semver) such as `12`,
   *   `12.6.0` or `<12`
   *  - `latest`: Latest available Node version
   *  - `lts`: Latest LTS Node version
   *  - `global`: Global Node version
   *    - Using the home directory
   *      [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) or
   *      [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *    - [Some similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   *      used by other Node.js version managers are also searched for
   *    - If nothing is found, defaults to the current process's Node version
   *  - `local`: Current directory's Node version
   *    - Using the current directory or parent directories
   *      [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
   *      [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *      or
   *      [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   *    - Defaults to the `global` version
   *  - a file path towards a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
   *    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
   *    or
   *    [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
   */
  versionRange: string,

  /**
   * File or command to execute. Both global and local binaries can be executed.
   * Must be compatible with the specific Node `versionRange`. For example `npm`
   * is [only compatible with Node `>=6`](https://github.com/npm/cli#important).
   */
  command: string,

  /**
   * Arguments passed to the `command`.
   */
  args: string[],

  options?: Options,
): Promise<ProcessInfo>

export default function nvexeca(
  versionRange: string,
  command: string,
  options?: Options,
): Promise<ProcessInfo>
