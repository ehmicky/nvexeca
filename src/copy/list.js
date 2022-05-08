import { readdir, stat, readFile } from 'fs/promises'
import { delimiter, normalize } from 'path'

import { isDirectory } from 'path-type'

import { getContent } from './content.js'
import { isOutputDir } from './output.js'

// Retrieve the list of binaries to copy.
// Look inside each directory in `PATH` to find any npm global binary executed
// with Node.
export const listSrcPaths = async function (pathValue) {
  const srcBinDirs = pathValue.split(delimiter)
  const srcPaths = await Promise.all(srcBinDirs.map(getSrcPaths))
  return srcPaths.flat().filter(hasPriority)
}

const getSrcPaths = async function (srcBinDir) {
  const srcBinDirA = normalize(srcBinDir)

  if (isOutputDir(srcBinDirA)) {
    return []
  }

  if (!(await isDirectory(srcBinDirA))) {
    return []
  }

  const filenames = await readdir(srcBinDirA)
  const srcPaths = await Promise.all(
    filenames.map((filename) =>
      getSrcPath({ srcBinDir: srcBinDirA, filenames, filename }),
    ),
  )
  return srcPaths.flat()
}

// We are looking for *.cmd files that have a sibling Bash file. Those are
// most likely to be npm global binaries.
// Each detected *.cmd file also return its sibling Bash and Powershell file.
const getSrcPath = async function ({ srcBinDir, filenames, filename }) {
  if (!CMD_BINARY_REGEXP.test(filename)) {
    return []
  }

  const bashFilename = filename.replace(CMD_BINARY_REGEXP, '')

  if (!(await isNodeBinary(srcBinDir, filenames, bashFilename))) {
    return []
  }

  const ps1Filename = filename.replace(CMD_BINARY_REGEXP, '.ps1')

  const srcPaths = await readSrcPaths({
    srcBinDir,
    bashFilename,
    filename,
    ps1Filename,
    filenames,
  })
  return srcPaths
}

const CMD_BINARY_REGEXP = /\.cmd$/u

// npm global binaries are not necessary executed with node. For example, a npm
// package can have no shabang or use a different shabang than node. Those do
// not need to be fixed, i.e. can be skipped.
// We detect this by looking at the binary file's content looking for the `node`
// word.
const isNodeBinary = async function (srcBinDir, filenames, bashFilename) {
  if (!filenames.includes(bashFilename)) {
    return false
  }

  const bashPath = `${srcBinDir}/${bashFilename}`
  const bashStat = await stat(bashPath)

  if (!bashStat.isFile()) {
    return false
  }

  const bashContent = await readFile(bashPath, 'utf8')
  return NODE_DETECT_REGEXP.test(bashContent)
}

// This works with both normal shim files and `npm`/`npx` which use slightly
// different shim files. We support `npm`/`npm` >= 6.14.15 and
// `cmd-shim` >=3.0.3 since this is shipped with Node 14.18.0 (our minimally
// supported Node version)
const NODE_DETECT_REGEXP = /\[ -x "(\$basedir\/node|\$NODE_EXE)" \]/u

const readSrcPaths = function ({
  srcBinDir,
  bashFilename,
  filename,
  ps1Filename,
  filenames,
}) {
  return Promise.all([
    readSrcPath({ type: 'bash', srcBinDir, filename: bashFilename }),
    readSrcPath({ type: 'cmd', srcBinDir, filename }),
    // npm and npx do not have *.ps1 files
    ...(filenames.includes(ps1Filename)
      ? [readSrcPath({ type: 'ps1', srcBinDir, filename: ps1Filename })]
      : []),
  ])
}

// Find out the content of the copied file
const readSrcPath = async function ({ type, srcBinDir, filename }) {
  const content = await getContent({ type, srcBinDir, filename })
  return { filename, content }
}

// The same binary might be present several times in `PATH`. We only keep the
// first one, to respect `PATH` priority order.
const hasPriority = function ({ filename }, index, srcPaths) {
  return srcPaths
    .slice(0, index)
    .every((srcPath) => srcPath.filename !== filename)
}
