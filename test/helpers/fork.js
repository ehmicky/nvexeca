import { spawn } from 'child_process'
import { argv } from 'process'

const [command, ...args] = argv.slice(2)
spawn(command, args, { stdio: 'inherit' })
