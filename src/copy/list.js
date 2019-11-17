import { delimiter } from 'path'
import { readdir, stat, readFile } from 'fs'
import { promisify } from 'util'

import pathExists from 'path-exists'

import { getContent } from './content.js'
import { isOutputDir } from './output.js'

const pReaddir = promisify(readdir)
const pStat = promisify(stat)
const pReadFile = promisify(readFile)

// Retrieve the list of binaries to copy.
// Look inside each directory in `PATH` to find any npm global binary executed
// with Node.
export const listSrcPaths = async function(pathValue, output) {
  const srcBinDirs = pathValue.split(delimiter)
  const srcPaths = await Promise.all(
    srcBinDirs.map(srcBinDir => getSrcPaths(srcBinDir, output)),
  )
  return srcPaths.flat().filter(hasPriority)
}

const getSrcPaths = async function(srcBinDir, output) {
  if (isOutputDir(srcBinDir)) {
    return []
  }

  if (!(await pathExists(srcBinDir))) {
    return []
  }

  const filenames = await pReaddir(srcBinDir)
  const srcPaths = await Promise.all(
    filenames.map(filename =>
      getSrcPath({ srcBinDir, filenames, filename, output }),
    ),
  )
  return srcPaths.flat()
}

// We are looking for *.cmd files that have a sibling Bash file. Those are
// most likely to be npm global binaries.
// Each detected *.cmd file also return its sibling Bash and Powershell file.
const getSrcPath = async function({ srcBinDir, filenames, filename, output }) {
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
    output,
  })
  return srcPaths
}

const CMD_BINARY_REGEXP = /\.cmd$/u

// npm global binaries are not necessary executed with node. For example, a npm
// package can have no shabang or use a different shabang than node. Those do
// not need to be fixed, i.e. can be skipped.
// We detect this by looking at the binary file's content looking for the `node`
// word.
const isNodeBinary = async function(srcBinDir, filenames, bashFilename) {
  if (!filenames.includes(bashFilename)) {
    return false
  }

  const bashPath = `${srcBinDir}/${bashFilename}`
  const bashStat = await pStat(bashPath)

  if (!bashStat.isFile()) {
    return false
  }

  const bashContent = await pReadFile(bashPath, 'utf8')
  return NODE_DETECT_REGEXP.test(bashContent)
}

// This works with both normal shim files and `npm`/`npx` which use slightly
// different shim files. We support `npm`/`npm` >=6.4.1 since this is shipped
// with Node 8.12.0 (our minimally supported Node version)
const NODE_DETECT_REGEXP = /\[ -x "(\$basedir\/node|\$NODE_EXE)" \]/u

const readSrcPaths = function({
  srcBinDir,
  bashFilename,
  filename,
  ps1Filename,
  filenames,
  output,
}) {
  return Promise.all([
    readSrcPath({ type: 'bash', srcBinDir, filename: bashFilename, output }),
    readSrcPath({ type: 'cmd', srcBinDir, filename, output }),
    // Powershell files were only added by `cmd-shim@3.0.0` (shipped since Node
    // 10.17.0)
    ...(filenames.includes(ps1Filename)
      ? [readSrcPath({ type: 'ps1', srcBinDir, filename: ps1Filename, output })]
      : []),
  ])
}

// Find out the content of the copied file
const readSrcPath = async function({ type, srcBinDir, filename, output }) {
  const content = await getContent({ type, srcBinDir, filename, output })
  return { filename, content }
}

// The same binary might be present several times in `PATH`. We only keep the
// first one, to respect `PATH` priority order.
const hasPriority = function({ filename }, index, srcPaths) {
  return srcPaths
    .slice(0, index)
    .every(srcPath => srcPath.filename !== filename)
}
