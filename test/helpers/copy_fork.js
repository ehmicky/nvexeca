import { version } from 'process'

import nvexeca from 'nvexeca'

nvexeca(version, 'printversion', { stdio: 'inherit' })
