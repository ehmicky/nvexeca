import { spawn } from 'node:child_process'
import { argv } from 'node:process'

const [command, ...args] = argv.slice(2)
spawn(command, args, { stdio: 'inherit' })
