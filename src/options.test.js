import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION, INVALID_VERSION } from './helpers/versions.test.js'

import nvexeca from 'nvexeca'

each(
  [
    [],
    [TEST_VERSION],
    [TEST_VERSION, true],
    [TEST_VERSION, 'node', true],
    [TEST_VERSION, 'node', [true]],
    [TEST_VERSION, 'node', [], true],
    [TEST_VERSION, 'node', [], { dry: '' }],
    [TEST_VERSION, 'node', [], { fetch: 0 }],
    [TEST_VERSION, 'node', [], { arch: true }],
    [INVALID_VERSION, 'node'],
  ],
  ({ title }, args) => {
    test(`Invalid arguments | ${title}`, async (t) => {
      await t.throwsAsync(nvexeca(...args))
    })
  },
)

each(
  [{ cwd: '.' }, { cwd: new URL('.', import.meta.url) }],
  ({ title }, opts) => {
    test(`Valid arguments | ${title}`, async (t) => {
      const { version } = await nvexeca(`v${TEST_VERSION}`, 'echo', opts)
      t.is(version, TEST_VERSION)
    })
  },
)
