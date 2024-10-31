import { platform } from 'node:process'

import { listSrcPaths } from './list.js'
import { getDistBinDir } from './output.js'
import { addToPath, getPath } from './path.js'
import { writeBinaries } from './write.js'

// npm installs global binaries on Unix with symlinks. But on Windows, it
// creates a small `*.cmd` file (https://github.com/npm/cmd-shim) that just
// forwards to `{executable} ...` where executable is guessed from the shabang
// (if any).
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
export const copyBinaries = async (execaOptions) => {
  if (platform !== 'win32') {
    return execaOptions
  }

  const { pathName, pathValue } = getPath(execaOptions)

  // No `PATH` environment variable. Very unlikely.
  if (pathValue === undefined) {
    return execaOptions
  }

  const srcPaths = await listSrcPaths(pathValue)

  if (srcPaths.length === 0) {
    return execaOptions
  }

  return applyCopy({ execaOptions, pathName, pathValue, srcPaths })
}

const applyCopy = async ({ execaOptions, pathName, pathValue, srcPaths }) => {
  const distBinDir = await getDistBinDir(srcPaths)
  await writeBinaries(srcPaths, distBinDir)

  const execaOptionsA = addToPath({
    execaOptions,
    pathName,
    pathValue,
    distBinDir,
  })
  return execaOptionsA
}
