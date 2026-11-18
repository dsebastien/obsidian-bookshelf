/**
 * Aspect ratio of a book (width / height), from the `aspectRatio` view option.
 */

/** 2:3, the shape of most printed books. */
export const DEFAULT_ASPECT_RATIO = 0.67
export const MIN_ASPECT_RATIO = 0.25
export const MAX_ASPECT_RATIO = 2.5
/** Fine enough for real cover shapes (0.67 for 2:3, 0.71 for A-series paper). */
export const ASPECT_RATIO_STEP = 0.01

/**
 * Read the `aspectRatio` option. A missing or invalid value gives the default.
 * A value outside the slider range is clamped, so a hand-edited `.base` file
 * cannot produce a zero height or a 0-pixel-wide book.
 */
export function normalizeAspectRatio(value: unknown): number {
    const ratio = typeof value === 'string' ? Number(value) : value
    if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio <= 0) {
        return DEFAULT_ASPECT_RATIO
    }
    return Math.min(MAX_ASPECT_RATIO, Math.max(MIN_ASPECT_RATIO, ratio))
}

/** Book height in pixels for a book width and an aspect ratio. */
export function bookHeightFor(width: number, aspectRatio: number): number {
    return Math.round(width / normalizeAspectRatio(aspectRatio))
}
