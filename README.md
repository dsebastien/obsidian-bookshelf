# Bookshelf for Obsidian

A community plugin that adds a **Bookshelf** view type to [Obsidian Bases](https://help.obsidian.md/bases), letting you display notes as a visual bookshelf — with real book covers on realistic shelves.

> Perfect for tracking books, movies, games, courses, papers, or any collection of notes where a visual, cover-driven layout beats a table or card grid.

## Features

- **Bookshelf view for Bases** — register a new view type alongside Table, Cards, and Gallery.
- **Cover-driven layout** — pick any property containing an image URL or vault path. Supports external URLs, `data:` URIs, and vault-relative paths.
- **Automatic spines** — notes without a cover get a colored spine with a vertical title, generated deterministically from the title so each book keeps its identity.
- **Shelf textures** — choose from oak, walnut, cherry, mahogany, pine, ebony, brushed metal, dark metal, white marble, black marble, concrete, and slate.
- **Grouping** — respects the Base's `groupBy` configuration. Each group becomes its own shelf with a header and count.
- **Property display** — any property added to the Base's display order appears under each book. Rating properties are highlighted.
- **Wikilink rendering** — `[[links]]` inside displayed properties are clickable and routed through Obsidian's standard link handling.
- **Interactions** — click a cover to open the note, Ctrl/Cmd+click to open in a new tab, right-click for a context menu (open, open in new tab, reveal in navigation).
- **Adjustable layout** — tune card size, gap between books, and aspect ratio directly from the view's options.
- **Desktop & mobile** — no desktop-only APIs.

## Requirements

- Obsidian **1.4.0** or newer.
- The **Bases** feature enabled (core plugin).

## Installation

### Community plugins (recommended once listed)

1. Open **Settings → Community plugins**.
2. Search for **Bookshelf**.
3. Install and enable.

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/dsebastien/obsidian-bookshelf/releases).
2. Copy them into `<Vault>/.obsidian/plugins/obsidian-bookshelf/`.
3. Reload Obsidian and enable **Bookshelf** in **Settings → Community plugins**.

## Quick start

1. Create or open a Base (`.base` file).
2. Add a view and select **Bookshelf** as its type.
3. In the view's options, set **Image property** to the frontmatter property holding your cover images (e.g. `cover`).
4. Add any properties you want to show under each book to the view's display order.
5. Optionally set `groupBy` on the Base to split books across multiple shelves.

A minimal note that works out of the box:

```yaml
---
title: The Pragmatic Programmer
author: '[[David Thomas]]'
cover: https://example.com/pragmatic.jpg
rating: 5
---
```

## Documentation

Full documentation lives in [`docs/`](./docs/) and is published at <https://dsebastien.github.io/obsidian-bookshelf>.

- [Usage](./docs/usage.md)
- [Configuration](./docs/configuration.md)
- [Tips & best practices](./docs/tips.md)
- [Release notes](./docs/release-notes.md)

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) and [CONTRIBUTING.md](./CONTRIBUTING.md).

Quick commands:

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `bun install`       | Install dependencies              |
| `bun run dev`       | Development build with watch mode |
| `bun run build`     | Production build                  |
| `bun run tsc:watch` | Type check in watch mode          |
| `bun run lint`      | Run ESLint                        |
| `bun run format`    | Format with Prettier              |
| `bun test`          | Run tests                         |

## Support

If this plugin is useful to you, consider [buying me a coffee](https://www.buymeacoffee.com/dsebastien) ❤️. You can also follow my work on [dsebastien.net](https://dsebastien.net) and [X](https://x.com/dSebastien).

## License

[MIT](./LICENSE) © Sébastien Dubois
