/**
 * Pure helpers to turn a raw cover property value into something the view can render.
 * Kept free of Obsidian runtime APIs so they can be unit tested.
 */

export type CoverReference =
    | { kind: 'none' }
    | { kind: 'url'; url: string }
    | { kind: 'vault'; linkpath: string }

const EXTERNAL_URL_REGEX = /^(https?:\/\/|data:|app:\/\/|file:\/\/)/i
const WIKILINK_REGEX = /^!?\[\[([^\]]*)\]\]$/
const MARKDOWN_IMAGE_REGEX = /^!?\[[^\]]*\]\(\s*<?([^)>]+?)>?\s*\)$/

/**
 * Parse a raw cover value. Accepts:
 * - external URLs (http, https, data, app, file)
 * - vault paths, with or without a leading slash, with `/` or `\` separators
 * - bare file names (resolved later through the metadata cache)
 * - wikilinks and embeds: `[[x.jpg]]`, `![[x.jpg|200]]`
 * - markdown images: `![alt](path/x.jpg)`, `![alt](<path with spaces.jpg>)`
 */
export function parseCoverValue(raw: string | null | undefined): CoverReference {
    let value = (raw ?? '').trim()
    // Strip wrapping quotes left by YAML or formulas
    value = value.replace(/^(["'])(.*)\1$/, '$2').trim()
    if (!value || value === 'null') return { kind: 'none' }

    const markdownMatch = MARKDOWN_IMAGE_REGEX.exec(value)
    if (markdownMatch?.[1]) {
        value = markdownMatch[1].trim()
    } else {
        const wikiMatch = WIKILINK_REGEX.exec(value)
        if (wikiMatch) {
            // Drop the alias / size (`|...`) and any heading or block ref (`#...`)
            value = (wikiMatch[1] ?? '').split('|')[0]!.split('#')[0]!.trim()
        }
    }

    if (!value) return { kind: 'none' }
    if (EXTERNAL_URL_REGEX.test(value)) return { kind: 'url', url: value }

    let linkpath = value.replace(/\\/g, '/').replace(/^\/+/, '')
    // Markdown image targets are often URL-encoded (`My%20Cover.jpg`)
    if (/%[0-9a-f]{2}/i.test(linkpath)) {
        try {
            linkpath = decodeURIComponent(linkpath)
        } catch {
            // Keep the raw value when it is not valid percent-encoding
        }
    }
    return linkpath ? { kind: 'vault', linkpath } : { kind: 'none' }
}

/**
 * Build a CSS `url()` value that stays valid whatever characters the URL holds.
 * Vault resource paths keep `'`, `(` and `)` unescaped, so a file such as
 * `Sophie's World (book).jpg` broke the old `url('...')` interpolation.
 */
export function toCssUrl(url: string): string {
    const escaped = url
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\a ')
        .replace(/\r/g, '\\d ')
    return `url("${escaped}")`
}
