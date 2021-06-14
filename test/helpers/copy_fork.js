import { version } from 'process'

// eslint-disable-next-line node/no-missing-import, import/no-unresolved
import nvexeca from 'nvexeca'

nvexeca(version, 'printversion', { stdio: 'inherit' })
