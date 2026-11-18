# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0](https://github.com/dsebastien/obsidian-bookshelf/compare/1.2.0...1.3.0) (2026-11-18)

Books without a cover image now get a real cover: a hardcover drawn by the plugin, with the title and the author lettered in gold leaf. The aspect ratio also moves in steps of 0.01, and its default is now 2:3, the shape of most printed books.

### Heads up: two things look different after the update

- **Books are taller by default.** The default aspect ratio changed from 1 (square) to 0.67 (2:3). Views where you never set **Aspect ratio** now show taller books. Square covers, such as music albums, don't fill a tall book: with **Image fit** on Contain they get empty space above and below, on Cover their sides are cut off. To keep the square look, open the view options and set **Aspect ratio** to 1.
- **Default covers replace the colored spine.** To keep the old colored block with its vertical title, set **Cover without image** to **Classic spine**.

### Default covers (#15)

- **Five styles**: pick one in **Cover without image**, in the Cover group of the view options.
    - **Cloth hardcover** (default): linen texture, a double gold frame, the title in small caps, the author in italics.
    - **Leather with label**: grained leather, a gold frame with dots in the corners, the title on a dark label.
    - **Library binding**: plain library cloth, the title in capitals between two gold rules. The easiest one to read on small cards.
    - **Mixed**: each book gets cloth, leather or library binding, picked from its title. Your shelf looks like an old library.
    - **Classic spine**: the look of earlier versions.
- **Lettering**: **Cover lettering** sets the foil: gold leaf (default), silver, copper, or blind (pressed into the cover, no foil).
- **Same title, same look**: the color (and, with Mixed, the binding) comes from the title, so a book looks the same in every view and after every reload. The colors are dark bookcloth and leather tones, so the lettering stays readable.
- **Author**: **Author property** names the property that holds the author. Leave it empty and Bookshelf tries `author`, then `authors`. A list shows the first author plus "et al.", a wikilink shows its display text, and a formula works too.
- **Spines**: at an aspect ratio of 0.4 or less, default covers turn into spines, with gold bands at the top and the bottom and the title running up the spine.
- **Dead image links**: a cover URL that doesn't load (a 404, a dead host, no network) now gets a default cover. Before, the book showed an empty gray block.
- **Any card size**: the cover scales with **Card size** and **Aspect ratio**. On small cards the author and the ornaments are dropped, and a long word makes the title smaller instead of breaking in the middle.
- **Screen readers**: each cover is labeled "Title by Author".

It's all CSS: no image file, nothing to download. All the options, with screenshots: [Default covers](https://dsebastien.github.io/obsidian-bookshelf/configuration.html#default-covers).

### Aspect ratio in steps of 0.01

The **Aspect ratio** slider now moves in steps of 0.01 instead of 0.25, still from 0.25 to 2.5. So you can match the real shape of your covers: 0.67 for 2:3 books, 0.71 for A-series and European formats. A missing or invalid value gives 0.67, and a value outside the range is clamped to the nearest limit.

## [1.2.0](https://github.com/dsebastien/obsidian-bookshelf/compare/1.1.1...1.2.0) (2026-11-04)

### Features

* **build:** ship curated release notes to the What's new tab and the release body ([87268f5](https://github.com/dsebastien/obsidian-bookshelf/commit/87268f5b0b0f1ca8fc580d96c6c4e992b95ff9c7))

### Bug Fixes

* **build:** keep severity strings out of the options keptAtError copies ([4060935](https://github.com/dsebastien/obsidian-bookshelf/commit/4060935eedd86c666d27e92ae591266d259e58c2))
* **plugin:** show covers with apostrophes and resolve covers like links ([cc65d92](https://github.com/dsebastien/obsidian-bookshelf/commit/cc65d92aa97abb7acac112de9648946a9d24de1f))
* **plugin:** stop Immer from freezing the shared default settings ([2fb822f](https://github.com/dsebastien/obsidian-bookshelf/commit/2fb822ffbbca18ece98921c4e4ba07bec498776f))

## [1.1.1](https://github.com/dsebastien/obsidian-bookshelf/compare/1.1.0...1.1.1) (2026-09-28)

### Bug Fixes

* **plugin:** keep the support block from stacking on every settings refresh ([97238bb](https://github.com/dsebastien/obsidian-bookshelf/commit/97238bbadc6ad63638297cdb86e9b1d868a645e2))

## [1.1.0](https://github.com/dsebastien/obsidian-bookshelf/compare/1.0.0...1.1.0) (2026-09-23)

### Features

* **build:** fail the build on a lockfile the catalog review cannot parse ([f14e066](https://github.com/dsebastien/obsidian-bookshelf/commit/f14e0667f56701923d29ef05b6d443c869f271f1))
* **build:** make the rule floor check that it is still wired in ([62b4eb6](https://github.com/dsebastien/obsidian-bookshelf/commit/62b4eb6204251ff9473f7824c7322a4585874ae9))
* **build:** refuse commits that loosen the rules instead of fixing the finding ([7ca4d52](https://github.com/dsebastien/obsidian-bookshelf/commit/7ca4d5239dabd41231891d1f90841caeec80bcf4))

### Bug Fixes

* **build:** drop the stale 2.0.1 key from versions.json ([ab227c4](https://github.com/dsebastien/obsidian-bookshelf/commit/ab227c4e5bba01d4a5320084a0c1687da054148c))
* **build:** harden the release path from the template ([6e2217f](https://github.com/dsebastien/obsidian-bookshelf/commit/6e2217fd482c0f3542abf2291567da5633903c71))
* **build:** name the last release before a floor raise in versions.json ([ce1f2aa](https://github.com/dsebastien/obsidian-bookshelf/commit/ce1f2aa1d0f7f6ab2c88e9e1545fa5a010d8a97c))
* **build:** rebuild versions.json from the published releases ([8faaac4](https://github.com/dsebastien/obsidian-bookshelf/commit/8faaac48955ea3a2172273a9ecd57ef555af61fc))
* **deps:** move the fast-uri override off the vulnerable line ([e3fe0fb](https://github.com/dsebastien/obsidian-bookshelf/commit/e3fe0fb0aa36c18d0c86f487123235d557a5a15f))
* **plugin:** drop the no-unused-vars suppression from the Bases types ([3457fcb](https://github.com/dsebastien/obsidian-bookshelf/commit/3457fcb6a9bad855ebbbca60d16adf16098b8715))

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



















