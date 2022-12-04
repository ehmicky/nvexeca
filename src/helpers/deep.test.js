import { HELPER_VERSION } from './versions.test.js'

import nvexeca from 'nvexeca'

nvexeca(HELPER_VERSION, 'node', ['--version'], { stdio: 'inherit' })
