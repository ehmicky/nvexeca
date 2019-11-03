import { platform, execPath } from 'process'
import { dirname } from 'path'

import { npm, yarn } from 'global-dirs'
import test from 'ava'

import nvexeca from '../src/main.js'

import { HELPER_VERSION } from './helpers/versions.js'

test('Works with npm', async t => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'npm', [
    '-g',
    'prefix',
  ])
  const { stdout } = await childProcess

  t.is(stdout, npm.prefix)
})

test('Works with yarn', async t => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'yarn', ['run', 'env'])
  const { stdout } = await childProcess
  const jsonOutput = stdout
    .split('\n')
    .slice(1, -1)
    .join('\n')
  const { PREFIX } = JSON.parse(jsonOutput)

  t.is(PREFIX, yarn.prefix)
})

test('Works with child processes', async t => {
  const { childProcess } = await nvexeca(HELPER_VERSION, 'node', [
    '-p',
    'process.env.PREFIX',
  ])
  const { stdout } = await childProcess

  const prefix =
    platform === 'win32' ? dirname(execPath) : dirname(dirname(execPath))
  t.is(stdout, prefix)
})
