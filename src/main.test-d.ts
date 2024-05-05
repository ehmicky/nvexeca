import type { Stream } from 'node:stream'

import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import nvexeca, { type Options, type ProcessInfo } from 'nvexeca'

await nvexeca('14', 'echo')
// @ts-expect-error
await nvexeca()
// @ts-expect-error
await nvexeca('14')
const NODE_VERSION = 14
// @ts-expect-error
await nvexeca(NODE_VERSION, 'echo')
// @ts-expect-error
await nvexeca('14', true)

await nvexeca('14', 'echo', [])
await nvexeca('14', 'echo', ['arg'])
// @ts-expect-error
await nvexeca('14', 'echo', true)
// @ts-expect-error
await nvexeca('14', 'echo', [true])

await nvexeca('14', 'echo', {})
await nvexeca('14', 'echo', [], {})
await nvexeca('14', 'echo', ['arg'], {})
expectAssignable<Options>({})
// @ts-expect-error
await nvexeca('14', 'echo', true)
// @ts-expect-error
await nvexeca('14', 'echo', [], true)
// @ts-expect-error
await nvexeca('14', 'echo', { unknown: true })
// @ts-expect-error
await nvexeca('14', 'echo', [], { unknown: true })

await nvexeca('14', 'echo', { dry: true })
expectAssignable<Options>({ dry: true })
// @ts-expect-error
await nvexeca('14', 'echo', { dry: 'true' })

await nvexeca('14', 'echo', { progress: true })
expectAssignable<Options>({ progress: true })
// @ts-expect-error
await nvexeca('14', 'echo', { progress: 'true' })

await nvexeca('14', 'echo', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
// @ts-expect-error
await nvexeca('14', 'echo', { mirror: true })

await nvexeca('14', 'echo', { cancelSignal: AbortSignal.abort() })
expectAssignable<Options>({ cancelSignal: AbortSignal.abort() })
// @ts-expect-error
await nvexeca('14', 'echo', { signal: 'signal' })

await nvexeca('14', 'echo', { fetch: true })
await nvexeca('14', 'echo', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
// @ts-expect-error
await nvexeca('14', 'echo', { fetch: 'true' })

await nvexeca('14', 'echo', { arch: 'x64' })
expectAssignable<Options>({ arch: 'x64' })
// @ts-expect-error
await nvexeca('14', 'echo', { arch: true })
// @ts-expect-error
await nvexeca('14', 'echo', { arch: 'unknownArch' })

await nvexeca('14', 'echo', { cwd: '.' })
expectAssignable<Options>({ cwd: '.' })
expectAssignable<Options>({ cwd: new URL('file://example.com') })
// @ts-expect-error
await nvexeca('14', 'echo', { cwd: true })

await nvexeca('14', 'echo', { ipc: true })
expectAssignable<Options>({ ipc: true })
// @ts-expect-error
await nvexeca('14', 'echo', { ipc: 'true' })

const processInfo = await nvexeca('14', 'echo')
expectType<ProcessInfo>(processInfo)
const {
  childProcess,
  versionRange,
  version,
  command,
  args,
  execaOptions: { ipc },
} = processInfo

expectAssignable<Stream | null | undefined>(childProcess?.stdout)
expectAssignable<Stream | null | undefined>(childProcess?.all)
const { isCanceled, exitCode } = await childProcess!
expectType<boolean>(isCanceled)
expectType<number | undefined>(exitCode)

expectAssignable<string>(version)
expectAssignable<string>(versionRange)
expectAssignable<string>(command)
expectAssignable<string[]>(args)
expectAssignable<boolean | undefined>(ipc)
expectNotAssignable<string>(ipc)
