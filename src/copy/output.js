import { createHash } from 'crypto'
import { join } from 'path'

import globalCacheDir from 'global-cache-dir'

// Retrieve directory where binaries are copied to.
// Each `nvexeca()` call gets its own directory. This is because they might have
// different `PATH` environment variables or be called at different times
// leading to different available binaries.
// For performance reasons and better concurrent behavior, two `nvexeca()` calls
// with the same directory contents share the same directory. We do this by
// hashing that contents and including the hash in the directory filename.
export const getDistBinDir = async function (srcPaths) {
  const hash = getHash(srcPaths)
  const output = await getOutput()
  const distBinDir = join(output, BIN_DIR_PARENT, `${hash}${BIN_DIR_SUFFIX}`)
  return distBinDir
}

const getHash = function (srcPaths) {
  const contents = srcPaths.map(getSrcPathHash).join('\n')
  const hash = computeSha(contents)
  return hash
}

const getSrcPathHash = function ({ filename, content }) {
  return `${filename}\n${content}`
}

const computeSha = function (contents) {
  const hashStream = createHash('sha256')
  hashStream.update(contents)
  const hash = hashStream.digest('hex')
  return hash
}

// Retrieve cache directory
export const getOutput = function () {
  return globalCacheDir(CACHE_DIR)
}

const CACHE_DIR = 'nve'

// If the output directory is in the PATH, we ignore it.
// This happens on recursive calls.
export const isOutputDir = function (dir) {
  return dir.replace(TRAILING_SLASH_REGEXP, '').endsWith(BIN_DIR_SUFFIX)
}

const TRAILING_SLASH_REGEXP = /[/\\]$/u

const BIN_DIR_PARENT = 'all'
const BIN_DIR_SUFFIX = '-nve-bin'
