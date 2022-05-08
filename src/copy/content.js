import { readFile } from 'fs/promises'

// We need to slightly modify the binaries so that their file paths take into
// account the new location. Moving the binaries should make the
// `if exists ./node.exe` always fail, so this does not need to be changed.
// Note that global binaries use `cmd-shim` (https://github.com/npm/cmd-shim) to
// produce the shim files. But `npm` and `npx` global binaries shim files are
// slightly different (https://github.com/npm/cli/blob/latest/bin/npm)
export const getContent = async function ({ type, srcBinDir, filename }) {
  const path = `${srcBinDir}/${filename}`
  const content = await readFile(path, 'utf8')
  const distContent = CONTENTS[type](srcBinDir, content)
  return distContent
}

const getCmdContent = function (srcBinDir, content) {
  const srcBinDirA = srcBinDir.replace(SLASH_REGEXP, '\\')
  return content.replace(CMD_REGEXP, `${srcBinDirA}$2`)
}

const SLASH_REGEXP = /\//gu
// %%F|%~dp0 is used in npm|npx `cmd` binaries, %dp0% in other binaries
const CMD_REGEXP = /(%%F|%~dp0|%dp0%)(\\node_modules)/gu

// This also works with the Powershell file
const getShellContent = function (srcBinDir, content) {
  const srcBinDirA = srcBinDir.replace(BACKSLASH_REGEXP, '/')
  return content.replace(SHELL_REGEXP, `${srcBinDirA}$1`)
}

const BACKSLASH_REGEXP = /\\/gu
// `CLI_BASEDIR|NPM_PREFIX` is used in npm|npx shell binaries, $basedir in other
// shell binaries and in Powershell
const SHELL_REGEXP = /(\$basedir|\$CLI_BASEDIR|\$NPM_PREFIX)(\/node_modules)/gu

const CONTENTS = {
  cmd: getCmdContent,
  bash: getShellContent,
  ps1: getShellContent,
}
