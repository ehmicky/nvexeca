import { relative } from 'path'
import { promisify } from 'util'
import { readFile } from 'fs'

import { getDistBinString } from './output.js'

const pReadFile = promisify(readFile)

// We need to slightly modify the binaries so that their file paths take into
// account the new location. Moving the binaries should make the
// `if exists ./node.exe` always fail, so this does not need to be changed.
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
  return content.replace(CMD_REGEXP, `$1${relPath}\\$3`)
}

const CMD_REGEXP = /("(%dp0%|%~dp0)\\)([^"]+" %\*)/gu

// The Bash file changes in `cmd-shim@3.0.0` (shipped with Node `10.17.0`).
// However the RegExp below works regardless of those changes.
const getBashContent = function({ distBinDir, srcBinDir, content }) {
  const relPath = relative(distBinDir, srcBinDir).replace(BACKSLASH_REGEXP, '/')
  return content.replace(BASH_REGEXP, `$1${relPath}/$2`)
}

const BASH_REGEXP = /("\$basedir\/)([^"]+" "\$@")/gu

// The Powershell file only exists since `cmd-shim@3.0.0` (shipped with Node
// `10.17.0`).
const getPs1Content = function({ distBinDir, srcBinDir, content }) {
  const relPath = relative(distBinDir, srcBinDir).replace(BACKSLASH_REGEXP, '/')
  return content.replace(PS1_REGEXP, `$1${relPath}/$2`)
}

const PS1_REGEXP = /("\$basedir\/)([^"]+" \$args)/gu

const SLASH_REGEXP = /\//gu
const BACKSLASH_REGEXP = /\\/gu

const CONTENTS = {
  cmd: getCmdContent,
  bash: getBashContent,
  ps1: getPs1Content,
}
