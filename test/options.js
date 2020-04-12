import test from 'ava'
import { each } from 'test-each'

import nvexeca from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'

each(
  [
    [],
    [TEST_VERSION],
    [TEST_VERSION, true],
    [TEST_VERSION, 'node', true],
    [TEST_VERSION, 'node', [true]],
    [TEST_VERSION, 'node', [], true],
    [TEST_VERSION, 'node', [], { dry: '' }],
    [TEST_VERSION, 'node', [], { progress: '' }],
    [TEST_VERSION, 'node', [], { fetch: 0 }],
    [TEST_VERSION, 'node', [], { mirror: true }],
    [TEST_VERSION, 'node', [], { arch: true }],
    ['invalid_version', 'node'],
  ],
  ({ title }, [versionRange, command, args, opts]) => {
    test(`Invalid arguments | ${title}`, async (t) => {
      await t.throwsAsync(nvexeca(versionRange, command, args, opts))
    })
  },
)
