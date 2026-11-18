# Configuration

All configuration is per Bases view (`getBookshelfViewOptions` in `src/app/view/view-options.ts`). The plugin settings tab only holds support links.

| Key              | Type     | Default   | Notes                                                                       |
| ---------------- | -------- | --------- | --------------------------------------------------------------------------- |
| `cardSize`       | slider   | `150`     | Book width (px). 50–800.                                                    |
| `bookGap`        | slider   | `20`      | 20–60.                                                                      |
| `showShelf`      | toggle   | `true`    | `data-shelf-decorations`.                                                   |
| `showShadows`    | toggle   | `true`    | `data-book-shadows`.                                                        |
| `shelfTexture`   | dropdown | `oak`     | `data-shelf-texture`.                                                       |
| `coverProperty`  | property | —         | Falls back to `note.cover`.                                                 |
| `imageFit`       | dropdown | `contain` | `--image-fit`.                                                              |
| `defaultCover`   | dropdown | `cloth`   | `cloth`, `leather`, `library`, `mixed`, `classic`. `normalizeDefaultCover`. |
| `authorProperty` | property | —         | Unset: `note.author`, then `note.authors` (`DEFAULT_AUTHOR_PROPERTIES`).    |
| `coverFoil`      | dropdown | `gold`    | `gold`, `silver`, `copper`, `blind`. `data-cover-foil` on the container.    |
| `aspectRatio`    | slider   | `1`       | Height = `cardSize / aspectRatio`. 0.25–2.5.                                |

Default cover rendering: `src/app/view/default-cover.ts` (pure helpers, tested) + `renderDefaultCover` in `bookshelf-view.ts` + section "DEFAULT COVERS" in `src/styles.src.css` (container queries on `container: bookshelf-cover / size`).
