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
