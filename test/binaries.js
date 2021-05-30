import { join } from 'path'

import test from 'ava'
import del from 'del'
import execa from 'execa'

import nvexeca from '../src/main.js'

import { run } from './helpers/copy.js'
import { HELPER_VERSION, TEST_VERSION } from './helpers/versions.js'

const FIXTURES_DIR = join(__dirname, 'helpers', 'fixtures')
// `npm install -g` to `os.tmpdir()` throws a `chmod()` error, so we use a local
// directory
const TMP_DIR = join(__dirname, 'helpers', 'tmp')

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

  await del(TMP_DIR, { force: true })
})

test('npm', async (t) => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'npm', [
    'bin',
    '--loglevel',
    'info',
  ])
  const { stderr } = await childProcess

  t.true(stderr.includes(`node@v${HELPER_VERSION}`))
})

test('npx', async (t) => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'npx', [
    'node',
    '--version',
  ])
  const { stdout } = await childProcess
  t.is(stdout, `v${HELPER_VERSION}`)
})
