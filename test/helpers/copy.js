import { env } from 'process'
import { delimiter } from 'path'

import pathKey from 'path-key'

import nvexeca from '../../src/main.js'

import { TEST_VERSION } from './versions.js'

const PATH = pathKey()

export const runPrint = async function(t, pathParts, execaOptions) {
  await run({
    t,
    pathParts,
    execaOptions,
    version: TEST_VERSION,
    command: 'printversion',
    args: [],
  })
}

// Run nvexeca while appending some `pathParts` to the `PATH` environment
// variable. Then verify the command (usually `printversion` which prints
// `process.version`) output is showing the correct Node.js version.
// This is used to check that Windows binaries are using the right Node.js
// version.
export const run = async function({
  t,
  pathParts,
  execaOptions,
  version,
  command,
  args,
}) {
  const pathEnv = [...pathParts, env[PATH]].join(delimiter)
  const { childProcess } = await nvexeca(version, command, args, {
    env: { [PATH]: pathEnv },
    ...execaOptions,
  })

  const { stdout } = await childProcess
  t.is(stdout, `v${version}`)
}

export const runThrows = async function(t, execaOptions) {
  const { childProcess } = await nvexeca(
    TEST_VERSION,
    'printversion',
    execaOptions,
  )
  await t.throwsAsync(childProcess)
}
