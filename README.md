<img src="https://raw.githubusercontent.com/ehmicky/design/master/nve/nve.svg?sanitize=true" width="400"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/nvexeca.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/nvexeca)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/nvexeca)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/nvexeca.svg?logo=gitter)](https://gitter.im/ehmicky/nvexeca)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

nvm + execa = nvexeca.

[Execa](https://github.com/sindresorhus/execa) improves
[child processes](https://nodejs.org/api/child_process.html) execution with a
promise interface, cross-platform support, local binaries, interleaved output,
[and more](https://github.com/sindresorhus/execa#why).

nvexeca is a thin wrapper around Execa that runs any file or command using any
Node.js version.

Unlike [`nvm exec`](https://github.com/nvm-sh/nvm/blob/master/README.md#usage)
it:

- is run programmatically
- does not need a separate installation step for each Node version
- can run the major release's latest minor/patch version automatically
- does not require Bash
- is installed as a Node module
- works on Windows. No need to run as Administrator.

`nvexeca` executes a **single file or command**. It does not change the `node`
nor `npm` global binaries. To run a specific Node.js version for an **entire
project or shell session**, please use [`nvm`](https://github.com/nvm-sh/nvm),
[`nvm-windows`](https://github.com/coreybutler/nvm-windows),
[`n`](https://github.com/tj/n) or [`nvs`](https://github.com/jasongin/nvs)
instead.

# Example

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const nvexeca = require('nvexeca')

const { childProcess, versionRange, version } = await nvexeca('8', 'node', [
  '--version',
])
console.log(`Node ${versionRange} (${version})`) // Node 8 (8.16.1)
const { exitCode, stdout, stderr } = await childProcess
console.log(`Exit code: ${exitCode}`) // 0
console.log(stdout) // v8.16.1
```

# Install

```bash
npm install nvexeca
```

`node >=8.12.0` must be installed. However the command run by `nvexeca` can use
any Node version (providing it is compatible with it).

# Usage

## nvexeca(versionRange, command, args?, options?)

_versionRange_: `string`<br> _command_: `string`<br>_args_: `string[]?`<br>
_options_: `object?`<br>_Return value_: `Promise<object>`

`command` is the file or command to execute. `args` are the arguments passed to
it.

`versionRange` can be any [version range](https://github.com/npm/node-semver)
such as `12`, `12.6.0` or `<12`.

`command` must be compatible with the specific Node `versionRange`. For example
`npm` is
[only compatible with Node `>=6`](https://github.com/npm/cli#important).

Both global and local binaries can be executed.

The first time `nvexeca` is run with a new version, the Node binary is
downloaded under the hood. This initially takes few seconds. However subsequent
runs are almost instantaneous.

### Options

_Type_: `object`

All Execa options are available. Please refer to Execa for the list of
[possible options](https://github.com/sindresorhus/execa#options).

The
[`preferLocal` option](https://github.com/sindresorhus/execa/blob/master/readme.md#preferlocal)
is always `true`.

The following options are also available.

#### dry

_Type_: `boolean`<br>_Default_: `false`

Do not execute the command. This can be used to cache the initial Node.js binary
download.

#### progress

_Type_: `boolean`<br>_Default_: `false`

Whether to show a progress spinner when the Node binary is downloading.

#### mirror

_Type_: `string`<br>_Default_: `https://nodejs.org/dist`

Base URL to retrieve Node binaries. Can be overridden (for example
`https://npm.taobao.org/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

### Return value

_Type_: `Promise<object>`

#### childProcess

_Type_:
[`execaResult?`](https://github.com/sindresorhus/execa#execafile-arguments-options)

[`childProcess` instance](https://nodejs.org/api/child_process.html#child_process_class_childprocess).
It is also a `Promise` resolving or rejecting with a
[`childProcessResult`](https://github.com/sindresorhus/execa#childProcessResult).

This is `undefined` when the [`dry`](#dry) option is `true`.

#### versionRange

_Type_: `string`

Node.js version passed as input, such as `"v10"`.

#### version

_Type_: `string`

Normalized Node.js version. For example if `"v10"` was passed as input,
`version` will be `"10.17.0"`.

#### command

_Type_: `string`

File or command that was executed.

#### args

_Type_: `string[]`

Arguments that were passed to the `command`.

#### execaOptions

_Type_: `object`

[Options](https://github.com/sindresorhus/execa#options) that were passed to
[Execa](https://github.com/sindresorhus/execa).

## Native modules

If your code is using native modules, `nvexeca` works providing:

- they are built with [N-API](https://nodejs.org/api/n-api.html)
- the target Node.js version is `>=8.12.0` (since N-API was not available or
  stable before that)

Otherwise the following error message is shown:
`Error: The module was compiled against a different Node.js version`.

# See also

- [`nve`](https://github.com/ehmicky/nve): `nvexeca` as a CLI
- [`execa`](https://github.com/sindresorhus/execa): Process execution for humans
- [`get-node`](https://github.com/ehmicky/get-node): Download Node.js
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org
- [`global-cache-dir`](https://github.com/ehmicky/global-cache-dir): Get the
  global cache directory

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/nvexeca).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/nvexeca/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/nvexeca/commits?author=ehmicky" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
