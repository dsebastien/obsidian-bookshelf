/**
 * Default covers for books without a usable cover image.
 *
 * Pure helpers (no DOM, no Obsidian API) so they can be unit tested.
 * The look itself lives in `styles.src.css` (section "DEFAULT COVERS").
 */

/** Value of the `defaultCover` view option. */
export type DefaultCoverOption = 'classic' | 'cloth' | 'leather' | 'library' | 'mixed'

/** A concrete style (what `mixed` resolves to for one book). */
export type DefaultCoverStyle = Exclude<DefaultCoverOption, 'mixed'>

/** Value of the `coverFoil` view option. */
export type CoverFoil = 'gold' | 'silver' | 'copper' | 'blind'

export const DEFAULT_COVER_OPTIONS: readonly DefaultCoverOption[] = [
    'cloth',
    'leather',
    'library',
    'mixed',
    'classic'
]
export const DEFAULT_COVER: DefaultCoverOption = 'cloth'

export const COVER_FOILS: readonly CoverFoil[] = ['gold', 'silver', 'copper', 'blind']
export const DEFAULT_FOIL: CoverFoil = 'gold'

/** Properties tried for the author when the view has no "Author property". */
export const DEFAULT_AUTHOR_PROPERTIES: readonly string[] = ['note.author', 'note.authors']

/** The styles that `mixed` picks from. */
const MIXED_STYLES: readonly DefaultCoverStyle[] = ['cloth', 'leather', 'library']

/**
 * Dark, saturated bookcloth and leather colors. Gold, silver and copper foil
 * all keep their contrast on them (unlike random HSL colors).
 */
export const COVER_PALETTES: Readonly<
    Record<Exclude<DefaultCoverStyle, 'classic'>, readonly string[]>
> = {
    cloth: [
        '#5e1a1d',
        '#1d2a44',
        '#1f3d2b',
        '#4a2e1f',
        '#2b2b2e',
        '#3d2440',
        '#1f4a4f',
        '#6b3a1e',
        '#2f3f5a',
        '#4f4526'
    ],
    leather: [
        '#4a2a18',
        '#5c1f1a',
        '#2a1a12',
        '#1e2b22',
        '#3b2416',
        '#1c1a19',
        '#6a3b1c',
        '#2b2236'
    ],
    library: [
        '#7d2324',
        '#24406b',
        '#2f5a3a',
        '#2a2a2a',
        '#5a2d55',
        '#7a5520',
        '#1f5257',
        '#4b3a2a'
    ]
}

/** Colors of the title label on leather covers. */
export const LABEL_COLORS: readonly string[] = [
    '#6e1c1c',
    '#141414',
    '#1d3a2a',
    '#2a2140',
    '#4a1a2a'
]

/** A title this long or shorter leaves room for the author on a spine. */
export const SPINE_AUTHOR_MAX_TITLE_LENGTH = 16

/**
 * 32-bit string hash. Same algorithm as the spine color has always used,
 * so existing books keep their classic spine color.
 */
export function hashTitle(title: string): number {
    let hash = 0
    for (let i = 0; i < title.length; i++) {
        hash = (hash << 5) - hash + title.charCodeAt(i)
        hash = hash & hash
    }
    return hash
}

/** Classic spine color: muted HSL from the title hash. */
export function classicSpineColor(title: string): string {
    const hash = hashTitle(title)
    const hue = Math.abs(hash) % 360
    const saturation = 30 + (Math.abs(hash >> 8) % 30) // 30-60%
    const lightness = 35 + (Math.abs(hash >> 16) % 20) // 35-55%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/** Read the `defaultCover` option, with a fallback for unknown or missing values. */
export function normalizeDefaultCover(value: unknown): DefaultCoverOption {
    return DEFAULT_COVER_OPTIONS.includes(value as DefaultCoverOption)
        ? (value as DefaultCoverOption)
        : DEFAULT_COVER
}

/** Read the `coverFoil` option, with a fallback for unknown or missing values. */
export function normalizeFoil(value: unknown): CoverFoil {
    return COVER_FOILS.includes(value as CoverFoil) ? (value as CoverFoil) : DEFAULT_FOIL
}

/** The concrete style of one book. `mixed` picks one from the title hash. */
export function resolveCoverStyle(option: DefaultCoverOption, title: string): DefaultCoverStyle {
    if (option !== 'mixed') return option
    return MIXED_STYLES[Math.abs(hashTitle(title) >> 4) % MIXED_STYLES.length] ?? 'cloth'
}

/** Background color of a default cover. Same title, same color. */
export function pickCoverColor(style: DefaultCoverStyle, title: string): string {
    if (style === 'classic') return classicSpineColor(title)
    const palette = COVER_PALETTES[style]
    return palette[Math.abs(hashTitle(title)) % palette.length] ?? '#2b2b2e'
}

/** Color of the title label (leather style). */
export function pickLabelColor(title: string): string {
    return LABEL_COLORS[(Math.abs(hashTitle(title)) >> 3) % LABEL_COLORS.length] ?? '#141414'
}

/**
 * Length of the longest word, at least 6. The stylesheet divides the
 * available width by it, so a long word shrinks the title instead of
 * breaking in the middle.
 */
export function longestWordLength(title: string): number {
    const lengths = title
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map((word) => [...word].length)
    return Math.max(6, ...lengths)
}

/** `[[Target|Alias]]` → `Alias`, `[[Folder/Target]]` → `Target`. Plain text is kept. */
export function stripWikilink(value: string): string {
    return value
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
        .replace(/\[\[([^\]]+)\]\]/g, (_match, target: string) => {
            const withoutHeading = target.split('#')[0] ?? target
            return withoutHeading.split('/').pop() ?? withoutHeading
        })
        .trim()
}

/**
 * Author text for a cover. A list shows its first author, plus "et al."
 * when there are more. Wikilinks show their display text.
 */
export function formatAuthor(values: readonly string[]): string {
    const authors = values.map(stripWikilink).filter((author) => author.length > 0)
    const first = authors[0]
    if (!first) return ''
    return authors.length > 1 ? `${first} et al.` : first
}

/** Short author for a spine: the last name, or '' when the title is too long for both. */
export function spineAuthor(title: string, author: string): string {
    if (!author || [...title].length > SPINE_AUTHOR_MAX_TITLE_LENGTH) return ''
    const name = author.replace(/ et al\.$/, '').trim()
    return name.split(/\s+/).pop() ?? ''
}

/** Accessible name of a cover. */
export function coverAriaLabel(title: string, author: string): string {
    return author ? `${title} by ${author}` : title
}
