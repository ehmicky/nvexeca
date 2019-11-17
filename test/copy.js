import { platform } from 'process'
import { join } from 'path'

import test from 'ava'
import { each } from 'test-each'
import pathKey from 'path-key'

import { runPrint, run, runThrows } from './helpers/copy.js'
import { HELPER_VERSION } from './helpers/versions.js'

const FORK_FILE = join(__dirname, 'helpers', 'copy_fork.js')
const FIXTURES_DIR = join(__dirname, 'helpers', 'fixtures')

const PATH = pathKey()

if (platform !== 'win32') {
  test('Global binaries', async t => {
    await runPrint(t, [`${FIXTURES_DIR}/unix`])
  })
}

// We need to run tests serially because of some ETXTBUSY errors thrown
// otherwise
if (platform === 'win32') {
  each(['10.16.0', '13.1.0'], ({ title }, nodeVersion) => {
    const fixtureDir = join(FIXTURES_DIR, nodeVersion)

    test(`Global binaries | ${title}`, async t => {
      await runPrint(t, [fixtureDir])
    })

    test(`extendEnv: false | ${title}`, async t => {
      await runPrint(t, [fixtureDir], { extendEnv: false })
    })

    test(`Non-existing directory in PATH | ${title}`, async t => {
      await runPrint(t, [fixtureDir, `${__dirname}invalid`])
    })

    test(`Recursively | ${title}`, async t => {
      await run({
        t,
        pathParts: [fixtureDir],
        version: HELPER_VERSION,
        command: 'node',
        args: [FORK_FILE],
      })
    })

    test(`Binary twice in PATH | ${title}`, async t => {
      await runPrint(t, [fixtureDir, fixtureDir])
    })

    test(`*.cmd not a npm binary | ${title}`, async t => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'not_npm')])
    })

    test(`Not node executable | ${title}`, async t => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'not_node')])
    })

    test(`Sibling is a directory | ${title}`, async t => {
      await runPrint(t, [fixtureDir, join(FIXTURES_DIR, 'sibling_dir')])
    })
  })

  test('PATH: undefined', async t => {
    await runThrows(t, { env: { [PATH]: undefined } })
  })
}
