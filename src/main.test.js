import { ChildProcess } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import test from 'ava'
import { execa, execaCommand } from 'execa'
import pathKey from 'path-key'
import semver from 'semver'
import { each } from 'test-each'

import { run } from './helpers/copy.test.js'
import {
  TEST_VERSION,
  ALIAS_VERSION,
  HELPER_VERSION,
} from './helpers/versions.test.js'

// eslint-disable-next-line import/max-dependencies
import nvexeca from 'nvexeca'

const FIXTURES_DIR_URL = new URL('fixtures/', import.meta.url)
const FIXTURES_DIR = fileURLToPath(FIXTURES_DIR_URL)
// `npm install -g` to `os.tmpdir()` throws a `chmod()` error, so we use a local
// directory
const TMP_DIR = fileURLToPath(new URL('helpers/tmp', import.meta.url))
const FORK_FILE = fileURLToPath(
  new URL('helpers/fork.test.js', import.meta.url),
)
const DEEP_FILE = fileURLToPath(
  new URL('helpers/deep.test.js', import.meta.url),
)

test('Return normalized Node.js version', async (t) => {
  const { version } = await nvexeca(`v${TEST_VERSION}`, 'node', ['--version'])

  t.is(version, TEST_VERSION)
})

test('Return non-normalized Node.js version', async (t) => {
  const { versionRange } = await nvexeca(`v${TEST_VERSION}`, 'node', [
    '--version',
  ])

  t.is(versionRange, `v${TEST_VERSION}`)
})

test('Can use aliases', async (t) => {
  const { version } = await nvexeca(ALIAS_VERSION, 'node', ['--version'])
  t.is(semver.clean(version), version)
})

test('Can omit arguments but specify options', async (t) => {
  const { version } = await nvexeca(`v${TEST_VERSION}`, 'echo', {})

  t.is(version, TEST_VERSION)
})

test('Can omit both arguments and options', async (t) => {
  const { version } = await nvexeca(`v${TEST_VERSION}`, 'echo')

  t.is(version, TEST_VERSION)
})

test('Returns the modified command', async (t) => {
  const { command } = await nvexeca(TEST_VERSION, 'node', ['--version'])

  t.not(command, 'node')
})

test('Returns the modified args', async (t) => {
  const { args } = await nvexeca(TEST_VERSION, 'node', ['--version'])

  t.deepEqual(args, ['--version'])
})

test('Returns the Execa options', async (t) => {
  const {
    execaOptions: { preferLocal },
  } = await nvexeca(TEST_VERSION, 'node', ['--version'])

  t.true(preferLocal)
})

test('Forward child process', async (t) => {
  const { childProcess } = await nvexeca(TEST_VERSION, 'node', ['-p', '"test"'])

  t.true(childProcess instanceof ChildProcess)

  const { exitCode, stdout } = await childProcess
  t.is(exitCode, 0)
  t.is(stdout, 'test')
})

test('Dry mode', async (t) => {
  const { childProcess } = await nvexeca(TEST_VERSION, 'node', { dry: true })

  t.true(childProcess === undefined)
})

test('Global binaries integration test', async (t) => {
  await execa('npm', ['install', '-g', `${FIXTURES_DIR}/package`], {
    env: { NPM_CONFIG_PREFIX: TMP_DIR },
    stdio: 'ignore',
  })
  await run({
    t,
    // Unix installs inside `bin` but not Windows
    pathParts: [TMP_DIR, `${TMP_DIR}/bin`],
    version: TEST_VERSION,
    command: 'package',
    args: [],
  })

  await rm(TMP_DIR, { force: true, recursive: true })
})

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
  const { stdout } = await execaCommand(`nyc --silent -- node ${DEEP_FILE}`)

  t.is(stdout, `v${HELPER_VERSION}`)
})

test('Does not change process.execPath', async (t) => {
  // eslint-disable-next-line no-restricted-globals, n/prefer-global/process
  const { execPath } = process
  await nvexeca(TEST_VERSION, 'node', ['--version'])

  // eslint-disable-next-line no-restricted-globals, n/prefer-global/process
  const { execPath: newExecPath } = process
  t.is(newExecPath, execPath)
})

each(
  [
    { stdio: 'ignore', output: undefined },
    { stdio: 'inherit', output: undefined },
    { stdio: 'pipe', output: `v${TEST_VERSION}` },
    { output: `v${TEST_VERSION}` },
  ],
  ({ title }, { stdio, output }) => {
    test(`Can use stdio | ${title}`, async (t) => {
      const { childProcess } = await nvexeca(
        TEST_VERSION,
        'node',
        ['--version'],
        { stdio },
      )
      const { stdout } = await childProcess

      t.is(stdout, output)
    })
  },
)

test('Can fire global binaries', async (t) => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'npm', ['--version'])
  const { stdout } = await childProcess

  t.not(stdout, '')
})

test('Can fire local binaries', async (t) => {
  const { childProcess } = await runWithoutPath({})
  const { stdout } = await childProcess

  t.not(stdout, '')
})

test('Can use preferLocal: true (noop)', async (t) => {
  const { childProcess } = await runWithoutPath({ preferLocal: true })
  const { stdout } = await childProcess

  t.not(stdout, '')
})

test('Can use cwd options for local binaries', async (t) => {
  const { childProcess } = await runWithoutPath({ cwd: '/', stdio: 'ignore' })
  const { exitCode } = await t.throwsAsync(childProcess)

  t.not(exitCode, 0)
})

// Use `serial` to avoid "too many file open" on Windows
test.serial('Can run in shell mode', async (t) => {
  const { childProcess } = await nvexeca(
    TEST_VERSION,
    'node --version && node --version',
    [],
    { shell: true },
  )
  const { exitCode, stdout } = await childProcess

  t.is(exitCode, 0)
  t.is(stdout.replace('\r', ''), `v${TEST_VERSION}\nv${TEST_VERSION}`)
})

const runWithoutPath = (execaOptions) =>
  nvexeca(HELPER_VERSION, 'ava', ['--version'], {
    env: { [pathKey()]: '' },
    ...execaOptions,
  })

test.serial('Works with npm scripts', async (t) => {
  const { childProcess: nveChildProcess } = await nvexeca(
    HELPER_VERSION,
    'npm',
    ['--loglevel=silent', 'test'],
    { cwd: new URL('package_scripts', FIXTURES_DIR_URL) },
  )
  const { stdout: nveStdout } = await nveChildProcess
  t.is(nveStdout, `v${HELPER_VERSION}`)
})

test('Can abort the command', async (t) => {
  await nvexeca(TEST_VERSION, 'node', { dry: true })
  const { childProcess } = await nvexeca(TEST_VERSION, 'node', ['--version'], {
    signal: AbortSignal.abort(),
  })
  await t.throwsAsync(childProcess, { name: 'AbortError' })
})
