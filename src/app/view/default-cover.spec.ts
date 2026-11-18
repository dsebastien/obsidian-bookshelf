import { describe, expect, test } from 'bun:test'
import {
    COVER_PALETTES,
    LABEL_COLORS,
    classicSpineColor,
    coverAriaLabel,
    formatAuthor,
    hashTitle,
    longestWordLength,
    normalizeDefaultCover,
    normalizeFoil,
    pickCoverColor,
    pickLabelColor,
    resolveCoverStyle,
    spineAuthor,
    stripWikilink
} from './default-cover'

describe('hashTitle', () => {
    test('is deterministic', () => {
        expect(hashTitle('Dune')).toBe(hashTitle('Dune'))
        expect(hashTitle('Dune')).not.toBe(hashTitle('Ulysses'))
    })

    test('returns 0 for an empty title', () => {
        expect(hashTitle('')).toBe(0)
    })
})

describe('classicSpineColor', () => {
    test('keeps the historical spine color', () => {
        // Same output as the former BookshelfView.generateSpineColor
        const hash = hashTitle('Meditations')
        const expected = `hsl(${Math.abs(hash) % 360}, ${30 + (Math.abs(hash >> 8) % 30)}%, ${35 + (Math.abs(hash >> 16) % 20)}%)`
        expect(classicSpineColor('Meditations')).toBe(expected)
    })
})

describe('normalizeDefaultCover', () => {
    test('keeps known values', () => {
        for (const value of ['classic', 'cloth', 'leather', 'library', 'mixed']) {
            expect(normalizeDefaultCover(value)).toBe(value as never)
        }
    })

    test('falls back to cloth', () => {
        expect(normalizeDefaultCover(undefined)).toBe('cloth')
        expect(normalizeDefaultCover(null)).toBe('cloth')
        expect(normalizeDefaultCover('deco')).toBe('cloth')
        expect(normalizeDefaultCover(3)).toBe('cloth')
    })
})

describe('normalizeFoil', () => {
    test('keeps known values and falls back to gold', () => {
        expect(normalizeFoil('silver')).toBe('silver')
        expect(normalizeFoil('blind')).toBe('blind')
        expect(normalizeFoil('platinum')).toBe('gold')
        expect(normalizeFoil(undefined)).toBe('gold')
    })
})

describe('resolveCoverStyle', () => {
    test('returns concrete styles unchanged', () => {
        expect(resolveCoverStyle('leather', 'Dune')).toBe('leather')
        expect(resolveCoverStyle('classic', 'Dune')).toBe('classic')
    })

    test('mixed picks cloth, leather or library, always the same for a title', () => {
        const titles = ['Dune', 'Ulysses', 'Meditations', 'The Name of the Rose', 'Emma', 'Ivanhoe']
        const styles = new Set<string>()
        for (const title of titles) {
            const style = resolveCoverStyle('mixed', title)
            expect(['cloth', 'leather', 'library']).toContain(style)
            expect(resolveCoverStyle('mixed', title)).toBe(style)
            styles.add(style)
        }
        expect(styles.size).toBeGreaterThan(1)
    })
})

describe('pickCoverColor', () => {
    test('uses the palette of the style', () => {
        expect(COVER_PALETTES.cloth).toContain(pickCoverColor('cloth', 'Dune'))
        expect(COVER_PALETTES.leather).toContain(pickCoverColor('leather', 'Dune'))
        expect(COVER_PALETTES.library).toContain(pickCoverColor('library', 'Dune'))
    })

    test('classic keeps the HSL color', () => {
        expect(pickCoverColor('classic', 'Dune')).toBe(classicSpineColor('Dune'))
    })

    test('works for an empty title', () => {
        expect(COVER_PALETTES.cloth).toContain(pickCoverColor('cloth', ''))
    })
})

describe('pickLabelColor', () => {
    test('uses the label palette', () => {
        expect(LABEL_COLORS).toContain(pickLabelColor('Dune'))
        expect(LABEL_COLORS).toContain(pickLabelColor(''))
    })
})

describe('longestWordLength', () => {
    test('returns the longest word, at least 6', () => {
        expect(longestWordLength('Dune')).toBe(6)
        expect(longestWordLength('The Pragmatic Programmer')).toBe(10)
        expect(longestWordLength('  Thinking,   Fast  ')).toBe(9)
        expect(longestWordLength('')).toBe(6)
    })

    test('counts characters, not UTF-16 units', () => {
        expect(longestWordLength('𝔄𝔅ℭ𝔇𝔈𝔉𝔊')).toBe(7)
    })
})

describe('stripWikilink', () => {
    test('keeps plain text', () => {
        expect(stripWikilink('Umberto Eco')).toBe('Umberto Eco')
    })

    test('uses the alias or the last path segment', () => {
        expect(stripWikilink('[[Umberto Eco]]')).toBe('Umberto Eco')
        expect(stripWikilink('[[People/Umberto Eco|Eco]]')).toBe('Eco')
        expect(stripWikilink('[[People/Umberto Eco]]')).toBe('Umberto Eco')
        expect(stripWikilink('[[Umberto Eco#Bio]]')).toBe('Umberto Eco')
    })
})

describe('formatAuthor', () => {
    test('returns empty for no author', () => {
        expect(formatAuthor([])).toBe('')
        expect(formatAuthor(['', '  '])).toBe('')
    })

    test('shows the first author and et al.', () => {
        expect(formatAuthor(['Frank Herbert'])).toBe('Frank Herbert')
        expect(formatAuthor(['[[Andrew Hunt]]', '[[David Thomas]]'])).toBe('Andrew Hunt et al.')
    })
})

describe('spineAuthor', () => {
    test('returns the last name for a short title', () => {
        expect(spineAuthor('Dune', 'Frank Herbert')).toBe('Herbert')
        expect(spineAuthor('Dune', 'Andrew Hunt et al.')).toBe('Hunt')
    })

    test('returns empty for a long title or no author', () => {
        expect(spineAuthor('Thinking, Fast and Slow', 'Daniel Kahneman')).toBe('')
        expect(spineAuthor('Dune', '')).toBe('')
    })
})

describe('coverAriaLabel', () => {
    test('adds the author when known', () => {
        expect(coverAriaLabel('Dune', 'Frank Herbert')).toBe('Dune by Frank Herbert')
        expect(coverAriaLabel('Dune', '')).toBe('Dune')
    })
})
