# Release Notes

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
