import type { Stream } from 'stream'

import nvexeca, { Options, ProcessInfo } from 'nvexeca'
import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

await nvexeca('14', 'echo')
expectError(nvexeca())
expectError(nvexeca('14'))
expectError(nvexeca(14, 'echo'))
expectError(nvexeca('14', true))

await nvexeca('14', 'echo', [])
await nvexeca('14', 'echo', ['arg'])
expectError(nvexeca('14', 'echo', true))
expectError(nvexeca('14', 'echo', [true]))

await nvexeca('14', 'echo', {})
await nvexeca('14', 'echo', [], {})
await nvexeca('14', 'echo', ['arg'], {})
expectAssignable<Options>({})
expectError(await nvexeca('14', 'echo', true))
expectError(await nvexeca('14', 'echo', [], true))
expectError(await nvexeca('14', 'echo', { unknown: true }))
expectError(await nvexeca('14', 'echo', [], { unknown: true }))

await nvexeca('14', 'echo', { dry: true })
expectAssignable<Options>({ dry: true })
expectError(await nvexeca('14', 'echo', { dry: 'true' }))

await nvexeca('14', 'echo', { progress: true })
expectAssignable<Options>({ progress: true })
expectError(await nvexeca('14', 'echo', { progress: 'true' }))

await nvexeca('14', 'echo', { mirror: 'https://example.com' })
expectAssignable<Options>({ mirror: 'https://example.com' })
expectError(await nvexeca('14', 'echo', { mirror: true }))

await nvexeca('14', 'echo', { fetch: true })
await nvexeca('14', 'echo', { fetch: undefined })
expectAssignable<Options>({ fetch: true })
expectError(nvexeca('14', 'echo', { fetch: 'true' }))

await nvexeca('14', 'echo', { arch: 'x64' })
expectAssignable<Options>({ arch: 'x64' })
expectError(await nvexeca('14', 'echo', { arch: true }))
expectError(await nvexeca('14', 'echo', { arch: 'unknownArch' }))

await nvexeca('14', 'echo', { cwd: '.' })
expectAssignable<Options>({ cwd: '.' })
expectAssignable<Options>({ cwd: new URL('file://example.com') })
expectError(await nvexeca('14', 'echo', { cwd: true }))

await nvexeca('14', 'echo', { stripFinalNewline: true })
expectAssignable<Options>({ stripFinalNewline: true })
expectError(await nvexeca('14', 'echo', { stripFinalNewline: 'true' }))

const processInfo = await nvexeca('14', 'echo')
expectType<ProcessInfo>(processInfo)
const {
  childProcess,
  versionRange,
  version,
  command,
  args,
  execaOptions: { stripFinalNewline },
} = processInfo

expectAssignable<Stream | null | undefined>(childProcess?.stdout)
expectAssignable<Stream | null | undefined>(childProcess?.all)
const { isCanceled, exitCode } = await childProcess!
expectType<boolean>(isCanceled)
expectType<number>(exitCode)

expectAssignable<string>(version)
expectAssignable<string>(versionRange)
expectAssignable<string>(command)
expectAssignable<string[]>(args)
expectAssignable<boolean | undefined>(stripFinalNewline)
expectNotAssignable<string>(stripFinalNewline)
