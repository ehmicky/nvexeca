import nvexeca from 'nvexeca'

import { HELPER_VERSION } from './versions.test.js'

nvexeca(HELPER_VERSION, 'node', ['--version'], { stdio: 'inherit' })
