---
title: Usage
nav_order: 2
---

# Usage

## Requirements

- Obsidian **1.4.0** or newer.
- The **Bases** core feature enabled.

## Installation

### From community plugins

1. Open **Settings → Community plugins**.
2. Search for **Bookshelf**.
3. Install and enable.

### Manual install

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/dsebastien/obsidian-bookshelf/releases).
2. Copy them into `<Vault>/.obsidian/plugins/bookshelf-base/`.
3. Reload Obsidian and enable **Bookshelf** in **Settings → Community plugins**.

## Creating a bookshelf

1. Create or open a `.base` file.
2. Add a view.
3. Set the view type to **Bookshelf**.
4. Open the view's options and configure at least an **Image property** (see [Configuration](./configuration.md)).

## Adding books

Any note matching the Base's filters becomes a book. A typical book note looks like this:

```yaml
---
title: The Pragmatic Programmer
author: '[[David Thomas]]'
cover: https://example.com/pragmatic.jpg
rating: 5
status: read
---
```

### Cover images

The cover property may contain:

- An external URL: `https://example.com/cover.jpg`
- A `data:` URI
- A vault-relative path: `assets/covers/book.jpg` (resolved via Obsidian's resource path)

If the cover property is missing or empty for a note, Bookshelf renders a colored spine with a vertical title instead. Spine colors are derived deterministically from the title, so the same note always gets the same color.

### Grouping books across shelves

Set `groupBy` on the Base to split books onto multiple shelves. Each group becomes a separate shelf with a header showing the group label and the number of books. Without a grouping, all books appear on a single shelf labeled "All Books".

### Displaying properties under books

Any property added to the Base view's **display order** is shown under each book. The cover property itself is skipped to avoid duplication.

Properties whose id or display name contains "rating" are styled with a dedicated rating class.

Wikilinks (`[[Note]]` or `[[Note|Display]]`) inside displayed property values are rendered as clickable internal links and routed through Obsidian's standard link handling — Ctrl/Cmd+click opens them in a new tab.

## Interactions

| Action               | Result                               |
| -------------------- | ------------------------------------ |
| Click cover          | Open the note in the current tab     |
| Ctrl/Cmd+click cover | Open the note in a new tab           |
| Right-click cover    | Context menu (open, new tab, reveal) |
| Click a wikilink     | Open the linked note                 |

## Commands

The plugin does not currently register any slash commands. All configuration happens through the Base view's options panel.
