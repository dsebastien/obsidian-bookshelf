import type { ViewOption } from 'obsidian'

/**
 * Returns the view options for the Bookshelf view.
 * These appear in the view's settings panel.
 */
export function getBookshelfViewOptions(): ViewOption[] {
    return [
        // Layout options
        {
            type: 'slider',
            key: 'shelfHeight',
            displayName: 'Shelf height',
            min: 120,
            max: 300,
            step: 20,
            default: 180
        },
        {
            type: 'slider',
            key: 'bookWidth',
            displayName: 'Book width',
            min: 60,
            max: 150,
            step: 10,
            default: 100
        },
        {
            type: 'toggle',
            key: 'showTitles',
            displayName: 'Show titles',
            default: true
        },
        {
            type: 'toggle',
            key: 'showAuthors',
            displayName: 'Show authors',
            default: false
        },
        {
            type: 'toggle',
            key: 'showRatings',
            displayName: 'Show ratings',
            default: true
        },

        // Grouping options
        {
            type: 'group',
            displayName: 'Grouping',
            items: [
                {
                    type: 'toggle',
                    key: 'groupByStatus',
                    displayName: 'Group by reading status',
                    default: true
                },
                {
                    type: 'toggle',
                    key: 'showEmptyGroups',
                    displayName: 'Show empty groups',
                    default: false
                }
            ]
        },

        // Visual options
        {
            type: 'group',
            displayName: 'Visual',
            items: [
                {
                    type: 'toggle',
                    key: 'showShelfWood',
                    displayName: 'Show shelf texture',
                    default: true
                },
                {
                    type: 'slider',
                    key: 'bookGap',
                    displayName: 'Gap between books',
                    min: 0,
                    max: 20,
                    step: 2,
                    default: 8
                }
            ]
        }
    ]
}
