import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import test from 'ava'
import { execa } from 'execa'

import { run } from './helpers/copy.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

const FIXTURES_DIR = fileURLToPath(new URL('fixtures', import.meta.url))
// `npm install -g` to `os.tmpdir()` throws a `chmod()` error, so we use a local
// directory
const TMP_DIR = fileURLToPath(new URL('helpers/tmp', import.meta.url))

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
