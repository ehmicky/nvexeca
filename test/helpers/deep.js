// eslint-disable-next-line node/no-missing-import, import/no-unresolved
import nvexeca from 'nvexeca'

import { HELPER_VERSION } from './versions.js'

nvexeca(HELPER_VERSION, 'node', ['--version'], { stdio: 'inherit' })
