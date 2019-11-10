import { platform } from 'process'

import { getPath, addToPath } from './path.js'
import { getOutput, getDistBinDir } from './output.js'
import { listSrcPaths } from './list.js'
import { writeBinaries } from './write.js'

// npm install global binaries on Unix with symlinks. But on Windows, it creates
// a small `*.cmd` file (https://github.com/npm/cmd-shim) that just forwards to
// `{executable} ...` where executable is guessed from the shabang (if any).
// This is because Windows cannot execute shabang files otherwise.
// It also does it with a Bash file and a `*.ps1` file (Powershell).
// However the shim files prioritize the global binaries directory over the
// `PATH` environment variable by looking for a sibling `node.exe`. But `nve`
// needs to use the `PATH` environment variable.
// We fix this by copying the shim file to a directory that we push in front of
// the `PATH`. This removes that prioritization since there are no more
// `node.exe`.
// The fix is npm-specific. Yarn does not have that issue. Although it also
// checks for a sibling `node.exe`, there is never such a file in practice.
export const copyBinaries = async function(execaOptions) {
  if (platform !== 'win32') {
    return execaOptions
  }

  const { pathName, pathValue } = getPath(execaOptions)

  // No `PATH` environment variable. Very unlikely.
  if (pathValue === undefined) {
    return execaOptions
  }

  const output = await getOutput()
  const srcPaths = await listSrcPaths(pathValue, output)

  if (srcPaths.length === 0) {
    return execaOptions
  }

  return applyCopy({ execaOptions, pathName, pathValue, output, srcPaths })
}

const applyCopy = async function({
  execaOptions,
  pathName,
  pathValue,
  output,
  srcPaths,
}) {
  const distBinDir = getDistBinDir(output, srcPaths)
  await writeBinaries(srcPaths, distBinDir)

  const execaOptionsA = addToPath({
    execaOptions,
    pathName,
    pathValue,
    distBinDir,
  })
  return execaOptionsA
}
