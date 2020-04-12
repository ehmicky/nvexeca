# 3.0.0

## Breaking changes

- Rename `*` alias to [`latest` or `l`](/README.md#nvexecaversionrange-command-args-options)
- Rename `.` alias to [`current` or `c`](/README.md#nvexecaversionrange-command-args-options)
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
  [`arch` option](https://github.com/ehmicky/nvexeca/blob/master/README.md#arch)

# 2.1.0

## Features

- Add
  [`arch` option](https://github.com/ehmicky/nvexeca/blob/master/README.md#arch)
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
