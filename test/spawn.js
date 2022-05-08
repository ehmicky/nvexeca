import test from 'ava'
import nvexeca from 'nvexeca'
import pathKey from 'path-key'
import { each } from 'test-each'

import { TEST_VERSION, HELPER_VERSION } from './helpers/versions.js'

const FIXTURES_DIR_URL = new URL('helpers/fixtures/', import.meta.url)

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

test('Can run in shell mode', async (t) => {
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

const runWithoutPath = function (execaOptions) {
  return nvexeca(HELPER_VERSION, 'ava', ['--version'], {
    env: { [pathKey()]: '' },
    ...execaOptions,
  })
}

test('Works with npm scripts', async (t) => {
  const { childProcess: nveChildProcess } = await nvexeca(
    HELPER_VERSION,
    'npm',
    ['--loglevel=silent', 'test'],
    { cwd: new URL('package_scripts', FIXTURES_DIR_URL) },
  )
  const { stdout: nveStdout } = await nveChildProcess
  t.is(nveStdout, `v${HELPER_VERSION}`)
})
