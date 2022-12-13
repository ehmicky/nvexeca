import { mkdir, rename, writeFile, rm } from 'node:fs/promises'

import { pathExists } from 'path-exists'

// Copy binaries to the destination directory.
// Directories contain their contents hash in their filename, i.e. if they
// already exist, we can re-use them.
// We write files to a temporary directory first before renaming it to its final
// name. We do this to support concurrent calls. Otherwise a concurrent process
// might consider binaries already written based on their directory existing,
// even though they are being written. This would lead to `ETXTBUSY` errors.
export const writeBinaries = async (srcPaths, distBinDir) => {
  if (await pathExists(distBinDir)) {
    return
  }

  const tmpBinDir = getTmpBinDir(distBinDir)
  await mkdir(tmpBinDir, { recursive: true })

  await Promise.all(srcPaths.map((srcPath) => writeBinary(srcPath, tmpBinDir)))

  try {
    await rename(tmpBinDir, distBinDir)
    // This might fail if two concurrent processes are happening at exactly the
    // same time
  } catch {
    await rm(tmpBinDir, { force: true, recursive: true })
  }
}

const getTmpBinDir = (distBinDir) => {
  const randomId = String(Math.random()).replace('.', '')
  return `${distBinDir}-${randomId}`
}

const writeBinary = async ({ filename, content }, tmpBinDir) => {
  const tmpPath = `${tmpBinDir}/${filename}`
  await writeFile(tmpPath, content, { mode: DIST_MODE })
}

const DIST_MODE = 0o755
