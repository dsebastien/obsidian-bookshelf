import { describe, expect, test } from 'bun:test'
import { parseCoverValue, toCssUrl } from './cover-url'

describe('parseCoverValue', () => {
    test('returns none for empty values', () => {
        expect(parseCoverValue('')).toEqual({ kind: 'none' })
        expect(parseCoverValue('   ')).toEqual({ kind: 'none' })
        expect(parseCoverValue(null)).toEqual({ kind: 'none' })
        expect(parseCoverValue(undefined)).toEqual({ kind: 'none' })
        expect(parseCoverValue('null')).toEqual({ kind: 'none' })
        expect(parseCoverValue('[[]]')).toEqual({ kind: 'none' })
    })

    test('keeps external URLs', () => {
        expect(parseCoverValue('https://example.com/a.jpg')).toEqual({
            kind: 'url',
            url: 'https://example.com/a.jpg'
        })
        expect(parseCoverValue('data:image/png;base64,AAA')).toEqual({
            kind: 'url',
            url: 'data:image/png;base64,AAA'
        })
    })

    test('keeps vault paths and strips a leading slash', () => {
        expect(parseCoverValue('50 Resources/51 Attachments/x (book).jpg')).toEqual({
            kind: 'vault',
            linkpath: '50 Resources/51 Attachments/x (book).jpg'
        })
        expect(parseCoverValue('/a/b.png')).toEqual({ kind: 'vault', linkpath: 'a/b.png' })
    })

    test('converts Windows separators', () => {
        expect(parseCoverValue('50 Resources\\51 Attachments\\cover.png')).toEqual({
            kind: 'vault',
            linkpath: '50 Resources/51 Attachments/cover.png'
        })
    })

    test('keeps bare file names for link resolution', () => {
        expect(parseCoverValue('cover.jpg')).toEqual({ kind: 'vault', linkpath: 'cover.jpg' })
    })

    test('unwraps wikilinks and embeds', () => {
        expect(parseCoverValue('[[cover.jpg]]')).toEqual({ kind: 'vault', linkpath: 'cover.jpg' })
        expect(parseCoverValue('![[a/cover.jpg|200]]')).toEqual({
            kind: 'vault',
            linkpath: 'a/cover.jpg'
        })
        expect(parseCoverValue('"[[Sophie\'s World (book).jpg]]"')).toEqual({
            kind: 'vault',
            linkpath: "Sophie's World (book).jpg"
        })
    })

    test('unwraps markdown images', () => {
        expect(parseCoverValue('![](https://x.org/a.jpg)')).toEqual({
            kind: 'url',
            url: 'https://x.org/a.jpg'
        })
        expect(parseCoverValue('![alt](My%20Cover.jpg)')).toEqual({
            kind: 'vault',
            linkpath: 'My Cover.jpg'
        })
        expect(parseCoverValue('![alt](<a b/c d.png>)')).toEqual({
            kind: 'vault',
            linkpath: 'a b/c d.png'
        })
    })

    test('keeps apostrophes in file names', () => {
        expect(parseCoverValue("L'Instant Présent (book).png")).toEqual({
            kind: 'vault',
            linkpath: "L'Instant Présent (book).png"
        })
    })
})

describe('toCssUrl', () => {
    test('wraps the URL in double quotes', () => {
        expect(toCssUrl('https://x.org/a.jpg')).toBe('url("https://x.org/a.jpg")')
    })

    test('keeps apostrophes and parentheses inside the quoted string', () => {
        expect(toCssUrl("app://abc/Sophie's%20World%20(book).jpg?1")).toBe(
            'url("app://abc/Sophie\'s%20World%20(book).jpg?1")'
        )
    })

    test('escapes double quotes, backslashes and newlines', () => {
        expect(toCssUrl('a"b\\c\nd')).toBe('url("a\\"b\\\\c\\a d")')
    })
})
