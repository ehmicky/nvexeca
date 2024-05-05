# 11.0.0

## Breaking changes

- Upgrade [Execa](https://github.com/sindresorhus/execa) to
  [`9.0.0`](https://github.com/sindresorhus/execa/releases/tag/v9.0.0)

# 10.0.0

## Breaking changes

- Minimal supported Node.js version is now `18.18.0`

# 9.2.1

## Dependencies

- Upgrade [Execa](https://github.com/sindresorhus/execa) to
  [`8.0.0`](https://github.com/sindresorhus/execa/releases/tag/v8.0.0)

# 9.2.0

## Features

- The Node.js version can now be specified as a file path to a
  [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
  [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  or
  [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md).

```js
const { childProcess, version } = await nvexeca('/path/to/.nvmrc', 'node', [
  '--version',
])
```

# 9.1.1

## Bug fixes

- Ensure the [`signal` option](https://github.com/sindresorhus/execa/#signal-1)
  also cancels the command

# 9.1.0

## Features

- Make the [`signal` option](https://github.com/sindresorhus/execa/#signal-1)
  also cancel downloading the Node.js binary

# 9.0.0

## Breaking changes

- Minimal supported Node.js version is now `16.17.0`

# 8.5.0

## Features

- Upgrade Execa

# 8.4.0

## Features

- Improve tree-shaking support

# 8.3.0

## Features

- Reduce npm package size by 47%

# 8.2.0

## Features

- Reduce npm package size

# 8.1.0

## Features

- Add TypeScript types

# 8.0.0

## Breaking changes

- Minimal supported Node.js version is now `14.18.0`

## Features

- The [`cwd` option](https://github.com/ehmicky/nvexeca#cwd) can now be a
  `file:` URL

# 7.0.0

## Breaking changes

- Minimal supported Node.js version is now `12.20.0`
- This package is now an ES module. It can only be loaded with an `import` or
  `import()` statement, not `require()`. See
  [this post for more information](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## Bug fixes

- Fix support for the latest version of `npm`

# 6.0.1

## Bug fixes

- Fix crash when downloading several Node.js binaries in parallel

# 6.0.0

## Breaking changes

- Rename the [alias `here`](/README.md#nvexecaversionrange-command-args-options)
  to `local`

## Features

- Add the [alias `global`](/README.md#nvexecaversionrange-command-args-options)
  to target the global Node version, regardless of the current directory

# 5.0.0

## Breaking changes

- Rename the [alias `now`](/README.md#nvexecaversionrange-command-args-options)
  to `here`

# 4.0.0

## Breaking changes

- Aliases `c` and `current` renamed to `now`
- The [alias `now`](/README.md#nvexecaversionrange-command-args-options) now
  takes into account `package.json` `engines.node` field and
  [additional files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
  used by other Node.js version managers.
- Alias `l` removed: please use `latest` instead

## Features

- Added [alias `lts`](/README.md#nvexecaversionrange-command-args-options) to
  target the latest LTS version

# 3.0.1

## Bug fixes

- Fix aliases shortcuts `l` and `c`

# 3.0.0

## Breaking changes

- Rename `*` alias to
  [`latest` or `l`](/README.md#nvexecaversionrange-command-args-options)
- Rename `.` alias to
  [`current` or `c`](/README.md#nvexecaversionrange-command-args-options)
- Remove `_` alias

# 2.3.0

## Features

- Add [`fetch` option](/README.md#fetch) to control caching

## Bug fixes

- Checksum checks were not working when the `mirror` option was used

# 2.2.0

## Features

- Can use the `_` alias to refer to the
  [current process's Node.js version](/README.md#nvexecaversionrange-command-args-options)
- Can use the `.` alias to refer to the
  [current project's Node.js version](/README.md#nvexecaversionrange-command-args-options)
  using its `.nvmrc`, `.node-version` or `.naverc`. The current directory can be
  changed using the [`cwd` option](/README.md#cwd).

# 2.1.3

## Bug fixes

- Fix crash when using multiple drives on Windows

# 2.1.2

## Bug fixes

- Fix terminal color changing on Windows

# 2.1.1

## Bug fixes

- Fix
  [`arch` option](https://github.com/ehmicky/nvexeca/blob/main/README.md#arch)

# 2.1.0

## Features

- Add
  [`arch` option](https://github.com/ehmicky/nvexeca/blob/main/README.md#arch)
  to specify the CPU architecture.

# 2.0.0

## Breaking changes

- Minimal supported Node.js version is now `10.17.0`

# 1.7.0

## Features

- Node.js binary download is now 50% faster on Windows

## Bug fixes

- Fix crash when Node.js binary URL is invalid

# 1.6.0

## Features

- Node.js binary download is now twice faster on Windows

## Bug fixes

- Fix ARM, PowerPC, S390 support

# 1.5.5

## Bug fixes

- Fix running `npm` or `npx` binaries on Windows

# 1.5.4

## Bug fixes

- Fix global binaries
  [not working on Windows](https://github.com/ehmicky/nve/issues/14)

# 1.5.3

## Bug fixes

- Fix executing binaries by specifying their file paths on Windows

# 1.5.2

## Bug fixes

- Fix executing `yarn`.

# 1.5.1

## Bug fixes

- Executing `npm`, `yarn` and `pnpm` was not working properly, for example when
  doing global installs (`npm i -g ...`).

# 1.5.0

## Features

- Improve the internal directory structure used to cache the Node.js binary
- Cleanup temporary files when Node.js download fails

# 1.4.0

## Features

- Improve the appearance of the progress bar

# 1.3.0

## Features

- Ensure Node.js binaries are not corrupted by checking their
  [checksums](https://github.com/nodejs/node#verifying-binaries)
- Use cache when offline (no network connection)

# 1.2.0

## Features

- Make Node.js binary download twice faster on Linux and MacOS
- Improve error messages

# 1.1.2

## Dependencies

- Reduce the number of dependencies

# 1.1.1

## Dependencies

- Reduce the number of dependencies

# 1.1.0

## Features

- Upgrade `get-node` to `5.5.0`
