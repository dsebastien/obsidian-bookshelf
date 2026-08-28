# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.6.0...1.0.0) (2026-08-28)

### ⚠ BREAKING CHANGES

* **plugin:** minAppVersion moves 1.10.0 -> 1.13.0.

One commit instead of the fleet's usual two: the settings tab here was
still the template's untouched scaffold (follow button + support
section, zero real controls), so the port is a transplant of the
template's current declarative tab rather than a plugin-specific
rewrite, and it is inseparable from the typings bump it needs.

Catalog reviewer: CHANGELOG.md and eslint.config.ts back in the archive
(verified: archive builds, lints and tests green); sentence-case
re-enabled with the fleet brands config; "Personal Knowledge Management"
copy fix.

Security: 47 vulnerabilities (1 critical — handlebars 4.7.8 JS
injection in the release changelog toolchain) -> 0, via the template's
overrides block (handlebars 4.7.9, js-yaml 4.3.1, brace-expansion
2.1.4, fast-uri 3.1.5, lodash 4.18.1, no ajv pin) plus bun audit fix.

Toolchain: Bun 1.4.0, CI audit gate, test --isolate via `bun run test`,
@types pinned, tsconfig types [bun, node], bun-types in
minimumReleaseAgeExcludes.

Settings: template's declarative tab (control toggle example + action
row + render support group), Plugin.updateSettings with
persist-then-commit (template 3d4f911), `override` on Plugin.settings,
guard spec, AGENTS.md trap list. obsidian typings 1.12.0 -> 1.13.1.

### Features

* **plugin:** show what's new in a tab instead of a modal dialog ([9d4af67](https://github.com/dsebastien/obsidian-bookshelf/commit/9d4af67030e96a67750c0476ace74af897bdc68a))
* **plugin:** surface support CTAs everywhere users can see them ([28615d8](https://github.com/dsebastien/obsidian-bookshelf/commit/28615d870aaa28e2b4eda16ec736d08b0f45cdfc))
* **plugin:** sync with template 2.8.0+ line, declarative settings ([26a6cbf](https://github.com/dsebastien/obsidian-bookshelf/commit/26a6cbfa2f88934f79fa8986aec60b0c433d4328))

### Bug Fixes

* **plugin:** bring back the follow button and stack the support block ([f2769bc](https://github.com/dsebastien/obsidian-bookshelf/commit/f2769bc8721f14bbeff98f05939c18242b3f927c))
* **plugin:** drop the inert example toggle surfaced by the port ([dbc710e](https://github.com/dsebastien/obsidian-bookshelf/commit/dbc710ee90348c269debf2932668045d7ce4289f))
* **plugin:** serialize settings writes — overlapping edits lost data ([e56ba91](https://github.com/dsebastien/obsidian-bookshelf/commit/e56ba916929f4e45fb4b23c73acaaee676e77d60))

## [0.6.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.5.0...0.6.0) (2026-07-29)

### Features

* **plugin:** aggregate what's new dialogs across simultaneously updated plugins ([4009e7d](https://github.com/dsebastien/obsidian-bookshelf/commit/4009e7d08035d2cac2735a4aee940c17a3c3bf7f))

## [0.5.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.4.0...0.5.0) (2026-07-29)

### Features

* **plugin:** add Knowii community to the what's new dialog and harden it ([f631c8a](https://github.com/dsebastien/obsidian-bookshelf/commit/f631c8ad3f95039f31bfc164f3758b49a9294fee))

## [0.4.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.3.2...0.4.0) (2026-07-27)

### Features

* **plugin:** show a what's new dialog once after plugin updates ([8a3665d](https://github.com/dsebastien/obsidian-bookshelf/commit/8a3665d62d2b40833fd5c5ab86d2138055d1b69e))

## [0.3.2](https://github.com/dsebastien/obsidian-bookshelf/compare/0.3.1...0.3.2) (2026-07-17)

## [0.3.1](https://github.com/dsebastien/obsidian-bookshelf/compare/0.3.0...0.3.1) (2026-06-17)

### Bug Fixes

* **deps:** force @conventional-changelog/git-client to ^2.7.0 ([4a2443b](https://github.com/dsebastien/obsidian-bookshelf/commit/4a2443bdfbbb4b54c6bb6be6f668ee9de22cf51e))

## [0.3.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.7...0.3.0) (2026-06-17)

### Features

* **plugin:** add toggles to disable shelf decorations and book shadows ([2039615](https://github.com/dsebastien/obsidian-bookshelf/commit/20396156489d44089beffc5012016cff939e6b72)), closes [#4](https://github.com/dsebastien/obsidian-bookshelf/issues/4)

## [0.2.7](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.6...0.2.7) (2026-05-15)

## [0.2.6](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.5...0.2.6) (2026-05-15)

## [0.2.5](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.4...0.2.5) (2026-05-15)

## [0.2.4](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.3...0.2.4) (2026-05-15)

## [0.2.3](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.2...0.2.3) (2026-05-15)

## [0.2.2](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.1...0.2.2) (2026-05-15)

## [0.2.1](https://github.com/dsebastien/obsidian-bookshelf/compare/0.2.0...0.2.1) (2026-05-14)

## [0.2.0](https://github.com/dsebastien/obsidian-bookshelf/compare/0.1.0...0.2.0) (2026-05-13)

### Features

* **all:** updated scripts ([5c95e50](https://github.com/dsebastien/obsidian-bookshelf/commit/5c95e50d204566efa7d11f80ee0fa0914471537e))
* **all:** updated workflows and docs ([22498b0](https://github.com/dsebastien/obsidian-bookshelf/commit/22498b014e695f13a1c487ae16102e03b936ca8b))

## 0.1.0 (2026-02-02)

### Features

* add Bookshelf view for Obsidian Bases ([53659bb](https://github.com/dsebastien/obsidian-bookshelf/commit/53659bb481bcbc530082cffcc186fa9897254b03))
* **all:** added safety checks for cover images ([29e8855](https://github.com/dsebastien/obsidian-bookshelf/commit/29e8855c1c34d6a6cc5f90e3800eed12614cbc96))
* **all:** added textures and settings ([63d9661](https://github.com/dsebastien/obsidian-bookshelf/commit/63d96615ca97844c8e40d1b6dc8668f86879a7c6))
* **all:** improved textures ([7297ada](https://github.com/dsebastien/obsidian-bookshelf/commit/7297ada52aa5234f8a72df2ba1a92c4fb7d9e3fc))
* **all:** improved visuals ([b6f10c1](https://github.com/dsebastien/obsidian-bookshelf/commit/b6f10c183555899c22661ae83d1ce52dd6bf307b))

### Bug Fixes

* **all:** fixed links ([d48798e](https://github.com/dsebastien/obsidian-bookshelf/commit/d48798e66b8d4e2b20577614873f6d6765f061ac))
* format code with prettier ([43da46d](https://github.com/dsebastien/obsidian-bookshelf/commit/43da46d5e93e44ed85aab96023e48577601756b0))
* remove unused eslint-disable directives ([d857e67](https://github.com/dsebastien/obsidian-bookshelf/commit/d857e679748993424880bb09dd2e5e19496b235a))
* resolve lint errors ([9c51e47](https://github.com/dsebastien/obsidian-bookshelf/commit/9c51e4741ef90c34c04166a52872bec220e68ac6))
* resolve TypeScript errors ([78b248d](https://github.com/dsebastien/obsidian-bookshelf/commit/78b248d7fbc19782472c37906dd5fdcedb5ba2f3))















