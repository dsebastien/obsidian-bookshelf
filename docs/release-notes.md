# Release Notes

## 1.3.0 (2026-11-18)

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

## 1.2.0 (2026-11-04)

### Features

- **build:** ship curated release notes to the What's new tab and the release body

### Bug Fixes

- **build:** keep severity strings out of the options keptAtError copies
- **plugin:** show covers with apostrophes and resolve covers like links
- **plugin:** stop Immer from freezing the shared default settings

## 1.1.1 (2026-09-28)

### Bug Fixes

- **plugin:** keep the support block from stacking on every settings refresh

## 1.1.0 (2026-09-23)

### Features

- **build:** fail the build on a lockfile the catalog review cannot parse
- **build:** make the rule floor check that it is still wired in
- **build:** refuse commits that loosen the rules instead of fixing the finding

### Bug Fixes

- **build:** drop the stale 2.0.1 key from versions.json
- **build:** harden the release path from the template
- **build:** name the last release before a floor raise in versions.json
- **build:** rebuild versions.json from the published releases
- **deps:** move the fast-uri override off the vulnerable line
- **plugin:** drop the no-unused-vars suppression from the Bases types

## 1.0.0 (2026-08-28)

### ⚠ BREAKING CHANGES

- **plugin:** minAppVersion moves 1.10.0 -> 1.13.0.

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

- **plugin:** show what's new in a tab instead of a modal dialog
- **plugin:** surface support CTAs everywhere users can see them
- **plugin:** sync with template 2.8.0+ line, declarative settings

### Bug Fixes

- **plugin:** bring back the follow button and stack the support block
- **plugin:** drop the inert example toggle surfaced by the port
- **plugin:** serialize settings writes — overlapping edits lost data

## 0.6.0 (2026-07-29)

### Features

- **plugin:** aggregate what's new dialogs across simultaneously updated plugins

## 0.5.0 (2026-07-29)

### Features

- **plugin:** add Knowii community to the what's new dialog and harden it

## 0.4.0 (2026-07-27)

### Features

- **plugin:** show a what's new dialog once after plugin updates

## 0.3.2 (2026-07-17)

## 0.3.1 (2026-06-17)

### Bug Fixes

- **deps:** force @conventional-changelog/git-client to ^2.7.0

## 0.3.0 (2026-06-17)

### Features

- **plugin:** add toggles to disable shelf decorations and book shadows

## 0.2.7 (2026-05-15)

## 0.2.6 (2026-05-15)

## 0.2.5 (2026-05-15)

## 0.2.4 (2026-05-15)

## 0.2.3 (2026-05-15)

## 0.2.2 (2026-05-15)

## 0.2.1 (2026-05-14)

## 0.2.0 (2026-05-13)

### Features

- **all:** updated scripts
- **all:** updated workflows and docs

## 0.1.0 (2026-02-02)

### Features

- add Bookshelf view for Obsidian Bases
- **all:** added safety checks for cover images
- **all:** added textures and settings
- **all:** improved textures
- **all:** improved visuals

### Bug Fixes

- **all:** fixed links
- format code with prettier
- remove unused eslint-disable directives
- resolve lint errors
- resolve TypeScript errors
