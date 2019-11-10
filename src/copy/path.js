import { env } from 'process'
import { delimiter } from 'path'

import pathKey from 'path-key'

// Retrieve the `PATH` environment variable that will be used in the child
// process. This means we are emulating `execa` logic.
export const getPath = function({ extendEnv = true, env: envOpt }) {
  const fullEnv = { ...(extendEnv ? env : {}), ...envOpt }
  const pathName = pathKey({ env: fullEnv })
  const pathValue = fullEnv[pathName]
  return { pathName, pathValue }
}

// When copying global binaries (on Windows), add their directory to the `PATH`
// environment variable
export const addToPath = function({
  execaOptions,
  pathName,
  pathValue,
  distBinDir,
}) {
  const pathEnv = `${distBinDir}${delimiter}${pathValue}`
  return { ...execaOptions, env: { ...execaOptions.env, [pathName]: pathEnv } }
}
