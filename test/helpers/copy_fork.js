import { version } from 'process'

import nvexeca from '../../src/main.js'

nvexeca(version, 'printversion', { stdio: 'inherit' })
