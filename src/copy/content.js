import { relative } from 'path'
import { promisify } from 'util'
import { readFile } from 'fs'

import { getDistBinString } from './output.js'

const pReadFile = promisify(readFile)

// We need to slightly modify the binaries so that their file paths take into
// account the new location. Moving the binaries should make the
// `if exists ./node.exe` always fail, so this does not need to be changed.
// Note that global binaries use `cmd-shim` (https://github.com/npm/cmd-shim) to
// produce the shim files. But `npm` and `npx` global binaries shim files are
// slightly different (https://github.com/npm/cli/blob/latest/bin/npm)
export const getContent = async function({
  type,
  srcBinDir,
  filename,
  output,
}) {
  const path = `${srcBinDir}/${filename}`
  const content = await pReadFile(path, 'utf8')
  const distBinDir = getDistBinString(output, 'hash')
  const distContent = CONTENTS[type]({ distBinDir, srcBinDir, content })
  return distContent
}

// The *.cmd file changes in `cmd-shim@3.0.0` (shipped with Node `10.17.0`).
// However the RegExp below works regardless of those changes.
const getCmdContent = function({ distBinDir, srcBinDir, content }) {
  const relPath = relative(distBinDir, srcBinDir).replace(SLASH_REGEXP, '\\')
  return content.replace(CMD_REGEXP, `\\${relPath}$&`)
}

const SLASH_REGEXP = /\//gu
const CMD_REGEXP = /\\node_modules/gu

// The Bash file changes in `cmd-shim@3.0.0` (shipped with Node `10.17.0`).
// However the RegExp below works regardless of those changes.
// This also works with the Powershell file, which was added by `cmd-shim@3.0.0`
// (shipped with Node `10.17.0`).
const getShellContent = function({ distBinDir, srcBinDir, content }) {
  const relPath = relative(distBinDir, srcBinDir).replace(BACKSLASH_REGEXP, '/')
  return content.replace(SHELL_REGEXP, `/${relPath}$&`)
}

const BACKSLASH_REGEXP = /\\/gu
const SHELL_REGEXP = /\/node_modules/gu

const CONTENTS = {
  cmd: getCmdContent,
  bash: getShellContent,
  ps1: getShellContent,
}
