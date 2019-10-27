import nvexeca from '../../src/main.js'

import { HELPER_VERSION } from './versions.js'

nvexeca(HELPER_VERSION, 'node', ['--version'], { stdio: 'inherit' })
