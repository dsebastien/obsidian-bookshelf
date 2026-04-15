---
title: Configuration
nav_order: 3
---

# Configuration

All configuration happens in the **view options panel** of the Base view. Open the view's settings (gear icon) after selecting the **Bookshelf** view type.

## View options

### Layout

| Setting           | Type   | Default | Description                                                   |
| ----------------- | ------ | ------- | ------------------------------------------------------------- |
| Card size         | Slider | `150`   | Width of each book in pixels. Range: 50–800, step 10.         |
| Gap between books | Slider | `20`    | Horizontal gap between books in pixels. Range: 20–60, step 4. |

Book height is computed from `cardSize / aspectRatio` (see Cover section below).

### Shelf material

| Setting        | Type     | Default | Description                                           |
| -------------- | -------- | ------- | ----------------------------------------------------- |
| Shelf material | Dropdown | `Oak`   | Visual texture applied to the shelf behind the books. |

Available textures:

- **Woods**: Oak, Walnut, Cherry, Mahogany, Pine, Ebony
- **Metal**: Brushed Metal, Dark Metal
- **Stone**: White Marble, Black Marble, Concrete, Slate

### Cover

| Setting        | Type     | Default   | Description                                                                                                              |
| -------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| Image property | Property | _(none)_  | The property containing the cover image (URL, `data:` URI, or vault-relative path). Falls back to `note.cover` if unset. |
| Image fit      | Dropdown | `Contain` | How cover images fit the book shape. `Contain` preserves aspect ratio; `Cover` crops to fill.                            |
| Aspect ratio   | Slider   | `1`       | `cardSize ÷ aspectRatio` determines book height. Range: 0.25–2.5, step 0.25.                                             |

Typical aspect ratios:

- `0.67` — tall book covers (2:3)
- `1` — square
- `1.5` — wide / landscape

## Plugin settings tab

The plugin settings tab (**Settings → Community plugins → Bookshelf**) currently exposes only support and social links. All view behavior is configured per-view inside the Base.

## Base configuration that matters

Bookshelf reads three things from the Base view's configuration:

1. **Display order** — the list of properties to show under each book.
2. **Grouping (`groupBy`)** — if set, each group becomes a separate shelf.
3. **Filters** — standard Base filters decide which notes become books.

No additional Base-side configuration is required for Bookshelf.
