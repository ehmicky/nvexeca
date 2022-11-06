import { ChildProcess } from 'node:child_process'

import test from 'ava'
import nvexeca from 'nvexeca'
import semver from 'semver'

import { TEST_VERSION, ALIAS_VERSION } from './helpers/versions.js'

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
