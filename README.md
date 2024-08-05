<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/nve/nve_dark.svg"/>
  <img alt="nvexeca logo" src="https://raw.githubusercontent.com/ehmicky/design/main/nve/nve.svg" width="500"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/nvexeca)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/nvexeca)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

nvm + execa = nvexeca.

[Execa](https://github.com/sindresorhus/execa) improves
[child processes](https://nodejs.org/api/child_process.html) execution with a
promise interface, cross-platform support, local binaries, interleaved output,
[and more](https://github.com/sindresorhus/execa#features).

nvexeca is a thin wrapper around Execa to run any file or command using any
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

# Hire me

Please
[reach out](https://www.linkedin.com/feed/update/urn:li:activity:7117265228068716545/)
if you're looking for a Node.js API or CLI engineer (11 years of experience).
Most recently I have been [Netlify Build](https://github.com/netlify/build)'s
and [Netlify Plugins](https://www.netlify.com/products/build/plugins/)'
technical lead for 2.5 years. I am available for full-time remote positions.

# Example

```js
import nvexeca from 'nvexeca'

const { childProcess, versionRange, version } = await nvexeca('8', 'node', [
  '--version',
])
console.log(`Node ${versionRange} (${version})`) // Node 8 (8.16.2)
const { exitCode, stdout, stderr } = await childProcess
console.log(`Exit code: ${exitCode}`) // 0
console.log(stdout) // v8.16.2
```

# Install

```bash
npm install nvexeca
```

`node >=18.18.0` must be installed. However the command run by `nvexeca` can use
any Node version (providing it is compatible with it).

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

To use this as a CLI instead, please check
[`nve`](https://github.com/ehmicky/nve).

# Usage

## nvexeca(versionRange, command, args?, options?)

Executes `command ...args` with a specific Node.js `versionRange`.

### Arguments

#### versionRange

_Type_: `string`

This can be:

- any [version range](https://github.com/npm/node-semver) such as `12`, `12.6.0`
  or `<12`
- `latest`: Latest available Node version
- `lts`: Latest LTS Node version
- `global`: Global Node version
  - Using the home directory [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) or
    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  - [Some similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
    used by other Node.js version managers are also searched for
  - If nothing is found, defaults to the current process's Node version
- `local`: Current directory's Node version
  - Using the current directory or parent directories
    [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
    [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
    or
    [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)
  - Defaults to the `global` version
- a file path towards a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc),
  [`package.json` (`engines.node` field)](https://docs.npmjs.com/files/package.json#engines)
  or
  [similar files](https://github.com/ehmicky/preferred-node-version/blob/main/README.md)

#### command

_Type_: `string`

File or command to execute. Both global and local binaries can be executed.

Must be compatible with the specific Node `versionRange`. For example `npm` is
[only compatible with Node `>=6`](https://github.com/npm/cli#important).

#### args

_Type_: `string[]?`

Arguments to pass to the [`command`](#command).

### Options

_Type_: `object?`

All Execa options are available. Please refer to Execa for the list of
[possible options](https://github.com/sindresorhus/execa/blob/main/docs/api.md#options).

The
[`preferLocal` option](https://github.com/sindresorhus/execa/blob/main/docs/api.md#optionspreferlocal)
is always `true`.

The following options are also available.

#### dry

_Type_: `boolean`\
_Default_: `false`

Do not execute the command. This can be used to cache the initial Node.js binary
download.

#### progress

_Type_: `boolean`\
_Default_: `false`

Whether to show a progress bar when the Node binary is downloading.

#### mirror

_Type_: `string`\
_Default_: `https://nodejs.org/dist`

Base URL to retrieve Node binaries. Can be overridden (for example
`https://npmmirror.com/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

#### fetch

_Type_: `boolean`\
_Default_: `undefined`

The list of available Node.js versions is cached for one hour by default. If the
`fetch` option is:

- `true`: the cache will not be used
- `false`: the cache will be used even if it's older than one hour

#### arch

_Type_: `string`\
_Default_: [`process.arch`](https://nodejs.org/api/process.html#process_process_arch)

Node.js binary's CPU architecture. This is useful for example when you're on x64
but would like to run Node.js x32.

All the values from
[`process.arch`](https://nodejs.org/api/process.html#process_process_arch) are
allowed except `mips` and `mipsel`.

#### cwd

_Type_: `string | URL`\
_Default_: `process.cwd()`

Current working directory of the child process.

When using the [`local` alias](#nvexecaversionrange-command-args-options), this
also starts looking for a Node.js version file from this directory.

### Return value

_Type_: `Promise<object>`

`Promise` resolved after the Node.js version has been cached locally (if it has
not been cached yet).

If you want to wait for the `command` to complete as well, you should `await`
the returned `childProcess`.

```js
const { childProcess } = await nvexeca('8', 'node', ['--version'])
const { exitCode, stdout, stderr } = await childProcess
```

#### childProcess

_Type_:
[`ResultPromise?`](https://github.com/sindresorhus/execa/blob/main/docs/api.md#return-value)

[`childProcess` instance](https://nodejs.org/api/child_process.html#child_process_class_childprocess).
It is also a `Promise` resolving or rejecting with a
[`Result`](https://github.com/sindresorhus/execa/blob/main/docs/api.md#result).
The `Promise` should be awaited if you want to wait for the process to complete.

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

[Options](https://github.com/sindresorhus/execa/blob/main/docs/api.md#options)
that were passed to [Execa](https://github.com/sindresorhus/execa).

## Initial download

The first time `nvexeca` is run with a new `VERSION`, the Node binary is
downloaded under the hood. This initially takes few seconds. However subsequent
runs are almost instantaneous.

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
- [`preferred-node-version`](https://github.com/ehmicky/preferred-node-version):
  Get the preferred Node.js version of a project or user
- [`node-version-alias`](https://github.com/ehmicky/node-version-alias): Resolve
  Node.js version aliases like `latest`, `lts` or `erbium`
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org
- [`global-cache-dir`](https://github.com/ehmicky/global-cache-dir): Get the
  global cache directory

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

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
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/nvexeca/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/nvexeca/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/nicolas-goudry"><img src="https://avatars.githubusercontent.com/u/8753998?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Goudry</b></sub></a><br /><a href="https://github.com/ehmicky/nvexeca/commits?author=nicolas-goudry" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/papb"><img src="https://avatars.githubusercontent.com/u/20914054?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pedro Augusto de Paula Barbosa</b></sub></a><br /><a href="#question-papb" title="Answering Questions">💬</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
