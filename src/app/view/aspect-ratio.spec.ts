import { describe, expect, test } from 'bun:test'
import {
    DEFAULT_ASPECT_RATIO,
    MAX_ASPECT_RATIO,
    MIN_ASPECT_RATIO,
    bookHeightFor,
    normalizeAspectRatio
} from './aspect-ratio'

describe('normalizeAspectRatio', () => {
    test('keeps valid values', () => {
        expect(normalizeAspectRatio(0.67)).toBe(0.67)
        expect(normalizeAspectRatio(1)).toBe(1)
        expect(normalizeAspectRatio('0.75')).toBe(0.75)
    })

    test('uses the 2:3 default for missing or invalid values', () => {
        expect(DEFAULT_ASPECT_RATIO).toBe(0.67)
        expect(normalizeAspectRatio(undefined)).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio(null)).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio('abc')).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio(0)).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio(-1)).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio(Number.NaN)).toBe(DEFAULT_ASPECT_RATIO)
        expect(normalizeAspectRatio(Number.POSITIVE_INFINITY)).toBe(DEFAULT_ASPECT_RATIO)
    })

    test('clamps to the slider range', () => {
        expect(normalizeAspectRatio(0.1)).toBe(MIN_ASPECT_RATIO)
        expect(normalizeAspectRatio(9)).toBe(MAX_ASPECT_RATIO)
    })
})

describe('bookHeightFor', () => {
    test('divides the width by the ratio', () => {
        expect(bookHeightFor(150, 0.67)).toBe(224)
        expect(bookHeightFor(150, 1)).toBe(150)
        expect(bookHeightFor(150, 0.25)).toBe(600)
    })

    test('never divides by zero', () => {
        expect(bookHeightFor(150, 0)).toBe(224)
    })
})
