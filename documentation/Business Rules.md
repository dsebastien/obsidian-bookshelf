# Business Rules

This document defines the core business rules. These rules MUST be respected in all implementations unless explicitly approved otherwise.

---

## Documentation Guidelines

When a new business rule is mentioned:

1. Add it to this document immediately
2. Use a concise format (single line or brief paragraph)
3. Maintain precision - do not lose important details for brevity
4. Include rationale where it adds clarity

---

## Covers

- A book uses its cover image when the cover value resolves (URL, `data:` URI, or a vault file found by path or by link rules). Otherwise it gets a default cover.
- An image URL that fails to load (probed with `new Image()`) also switches the book to the default cover. A book never shows an empty block.
- Default cover style comes from the `defaultCover` view option: `cloth` (default), `leather`, `library`, `mixed`, `classic`. Unknown or missing values mean `cloth`. `classic` is the pre-1.3 look (HSL block, white vertical title) and is the way to turn default covers off.
- Same title → same color and same `mixed` style, always. Both come from `hashTitle` (the historical spine hash, unchanged, so `classic` colors did not move). Colors come from fixed dark palettes per style, never random HSL (foil needs contrast).
- Title: `note.title`, else the file basename. Author: the `authorProperty` view option; when unset, `note.author`, then `note.authors`. A list shows its first value + " et al."; wikilinks show their display text.
- Default covers are CSS + DOM text only: no image file, no bundled font.
- Narrow covers (width / height < 0.4) show a spine layout. The spine adds the author's last name only when the title has ≤ 16 characters.
- Under 96px wide, author and ornaments are hidden. A long word shrinks the title (`--cover-longest-word`); words never break in the middle.

## Book size

- Book height = `cardSize / aspectRatio`. `aspectRatio` default is 0.67 (2:3, printed books); slider 0.25–2.5, step 0.01. A missing, invalid or ≤ 0 value gives 0.67; out-of-range values are clamped (`normalizeAspectRatio`), so a hand-edited `.base` never divides by zero.
