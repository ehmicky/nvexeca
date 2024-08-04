import { join } from 'node:path'
import { platform } from 'node:process'
import { fileURLToPath } from 'node:url'

import test from 'ava'
import pathKey from 'path-key'
import { each } from 'test-each'

import { runPrint, run, runThrows } from '../helpers/copy.test.js'
import { HELPER_VERSION } from '../helpers/versions.test.js'

const FORK_FILE = fileURLToPath(
  new URL('../helpers/copy_fork.test.js', import.meta.url),
)
const FIXTURES_DIR = fileURLToPath(new URL('../fixtures', import.meta.url))
const INVALID_DIR = fileURLToPath(new URL('../../invalid', import.meta.url))

const PATH = pathKey()

if (platform !== 'win32') {
  test('Global binaries', async (t) => {
    await runPrint(t, [`${FIXTURES_DIR}/unix`])
  })
}

// We need to run tests serially because of some ETXTBUSY errors thrown
// otherwise
if (platform === 'win32') {
  each(['10.16.0', '13.1.0', '18.20.0', '22.1.0'], ({ title }, nodeVersion) => {
    const fixtureDir = join(FIXTURES_DIR, nodeVersion)

    test.serial(`Global binaries | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir])
    })

    test.serial(`extendEnv: false | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir], { extendEnv: false })
    })

    test.serial(`Non-existing directory in PATH | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir, INVALID_DIR])
    })

    test.serial(`Recursively | ${title}`, async (t) => {
      await run({
        t,
        pathParts: [fixtureDir],
        version: HELPER_VERSION,
        command: 'node',
        args: [FORK_FILE],
      })
    })

    test.serial(`Binary twice in PATH | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir, fixtureDir])
    })

    test.serial(`*.cmd not a npm binary | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'not_npm')])
    })

    test.serial(`Not node executable | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'not_node')])
    })

    test.serial(`Sibling is a directory | ${title}`, async (t) => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'sibling_dir')])
    })
  })

  test.serial('PATH: undefined', async (t) => {
    await runThrows(t, { env: { [PATH]: undefined } })
  })
}
