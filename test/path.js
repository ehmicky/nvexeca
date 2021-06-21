import { fileURLToPath } from 'url'

import test from 'ava'
import execa from 'execa'
import nvexeca from 'nvexeca'
import pathKey from 'path-key'
import { each } from 'test-each'

import { HELPER_VERSION, TEST_VERSION } from './helpers/versions.js'

const FORK_FILE = fileURLToPath(new URL('./helpers/fork.js', import.meta.url))
const DEEP_FILE = fileURLToPath(new URL('./helpers/deep.js', import.meta.url))

each(
  [
    ['node', '--version'],
    ['node', DEEP_FILE],
    ['node', FORK_FILE, 'node', '--version'],
  ],
  [{}, { [pathKey()]: undefined }],
  ({ title }, args, env) => {
    test(`Works with child processes | ${title}`, async (t) => {
      const { childProcess } = await nvexeca(
        HELPER_VERSION,
        'node',
        [FORK_FILE, ...args],
        { env },
      )
      const { stdout } = await childProcess

      t.is(stdout.trim(), `v${HELPER_VERSION}`)
    })
  },
)

test.serial('Works with nyc as child', async (t) => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'nyc', [
    '--silent',
    '--',
    'node',
    '--version',
  ])
  const { stdout } = await childProcess

  t.is(stdout, `v${HELPER_VERSION}`)
})

test('Works with nyc as parent with node command', async (t) => {
  const { stdout } = await execa.command(`nyc --silent -- node ${DEEP_FILE}`)

  t.is(stdout, `v${HELPER_VERSION}`)
})

test('Does not change process.execPath', async (t) => {
  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process
  const { execPath } = process
  await nvexeca(TEST_VERSION, 'node', ['--version'])

  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process
  const { execPath: newExecPath } = process
  t.is(newExecPath, execPath)
})
