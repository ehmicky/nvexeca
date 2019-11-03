import { platform, execPath } from 'process'
import { dirname } from 'path'

import { npm, yarn } from 'global-dirs'

// npm, yarn and similar tools rely on the assumption that process.execPath
// is located in the same place as global binaries. This is not the case with
// nve so we need to override that logic by specifying the PREFIX environment
// variable which is used by those tools for that purpose.
// When the command is npm or yarn, we use `global-dirs` which provides the
// best value for `PREFIX` since it takes into account npmrc, npm_config_prefix
// environment variable, etc..
// However in child processes, we don't know whether npm or yarn will be used,
// so we use a simpler logic when the command is neither npm nor yarn (but those
// could be spawned in child processes).
export const getPrefix = function(command) {
  if (command === 'npm') {
    return npm.prefix
  }

  if (command === 'yarn') {
    return yarn.prefix
  }

  if (platform === 'win32') {
    return dirname(execPath)
  }

  return dirname(dirname(execPath))
}
