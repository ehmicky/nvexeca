import { version } from 'node:process'

import nvexeca from 'nvexeca'

nvexeca(version, 'printversion', { stdio: 'inherit' })
