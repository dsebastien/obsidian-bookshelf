---
title: Tips & best practices
nav_order: 90
---

# Tips and best practices

## Organizing a book collection

- Keep each book as its own note with consistent frontmatter (`title`, `author`, `cover`, `rating`, `status`, etc.).
- Store cover images in a dedicated folder (e.g. `assets/covers/`) and reference them by vault-relative path, so covers keep working offline.
- Use a Base filter like `status != "archived"` to focus on an active reading list, and a separate view for "everything".

## Making shelves meaningful with grouping

Set `groupBy` on the Base to turn shelves into categories:

- **By status**: reading, read, want-to-read.
- **By genre**: fiction, non-fiction, technical.
- **By rating**: 5★, 4★, 3★, …
- **By year**: 2026, 2025, 2024, …

Each group becomes its own shelf with a header and book count.

## Working with other collections

Although it's called "Bookshelf", nothing is book-specific. The same view works well for:

- Movies and series (use a poster as the cover).
- Video games (box art).
- Courses (thumbnail).
- Research papers (first-page preview or a PDF thumbnail).
- Albums, recipes, wines — anything with a dominant image.

## Default covers for albums, movies and games

Notes without an image get a default cover with the title and the "author". For other collections, point **Author property** at the matching property:

- `artists` for albums.
- `directors` for movies.
- `developers` or `studio` for games: whatever your notes use.

If one Base mixes several kinds of notes, a formula can pick the right property for each note. Add it to the Base:

```yaml
formulas:
    creator: if(authors, authors, if(artists, artists, directors))
```

Then select the `creator` formula in **Author property**. Lists still show the first name plus "et al.".

The default covers are drawn as books for now. Shapes for music CDs, PlayStation cases and PC game boxes are tracked in [issue #16](https://github.com/dsebastien/obsidian-bookshelf/issues/16).

## Choosing properties to display

- Keep it short: 2–4 properties max. Long blocks hurt the bookshelf aesthetic.
- Include at least the author or equivalent, plus one status-like property.
- Any property with "rating" in its id or display name is styled distinctly — take advantage of that for any score-like field.

## Performance

- Books without a cover image cost nothing to load: the default cover is drawn with CSS.
- Covers are rendered via CSS `background-image`. Use reasonably sized images (a few hundred KB each) — huge originals slow scrolling without any visual benefit.
- For very large collections, use Base filters or grouping so you render a few shelves at a time.

## Troubleshooting

### The Bookshelf view type doesn't appear

Bookshelf requires Obsidian's **Bases** feature. Make sure:

- You are on Obsidian `1.4.0` or newer.
- The Bases core plugin is enabled.
- The Bookshelf plugin is installed **and enabled** in **Settings → Community plugins**.

If the plugin loaded but the view type is still missing, check the developer console for a warning like `Failed to register Bookshelf view - Bases feature may not be enabled`.

### Covers don't show up

- Verify the **Image property** is set in the view options and matches the frontmatter key exactly.
- For vault-relative paths, make sure the file actually exists at that path.
- External URLs must be reachable; some hosts block hotlinking.
- If you see a default cover (a bound book with the title in gold) instead of your image, Bookshelf found no usable image. The property is missing or empty, the vault file doesn't exist, or the URL didn't load (a 404, a dead host, no network). Open the URL in a browser to check it.
- If you prefer the old colored spines, set **Cover without image** to **Classic spine**.

### Wikilinks in properties aren't clickable

Only wikilink syntax is detected: `[[Target]]` or `[[Target|Display]]`. Markdown links (`[text](url)`) are rendered as plain text.

### The plugin folder name matters

For a manual install, the folder must be `bookshelf-base` (matching the plugin `id` in `manifest.json`). Renaming it will prevent Obsidian from loading the plugin.
