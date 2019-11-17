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
