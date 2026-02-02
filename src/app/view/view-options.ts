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
            key: 'cardSize',
            displayName: 'Card size',
            min: 50,
            max: 800,
            step: 10,
            default: 150
        },
        {
            type: 'slider',
            key: 'bookGap',
            displayName: 'Gap between books',
            min: 20,
            max: 60,
            step: 4,
            default: 20
        },

        // Shelf texture
        {
            type: 'dropdown',
            key: 'shelfTexture',
            displayName: 'Shelf material',
            default: 'oak',
            options: {
                // Woods
                'oak': 'Oak',
                'walnut': 'Walnut',
                'cherry': 'Cherry',
                'mahogany': 'Mahogany',
                'pine': 'Pine',
                'ebony': 'Ebony',
                // Other materials
                'metal': 'Brushed Metal',
                'dark-metal': 'Dark Metal',
                'white-marble': 'White Marble',
                'black-marble': 'Black Marble',
                'concrete': 'Concrete',
                'slate': 'Slate'
            }
        },

        // Cover options
        {
            type: 'group',
            displayName: 'Cover',
            items: [
                {
                    type: 'property',
                    key: 'coverProperty',
                    displayName: 'Image property',
                    placeholder: 'Select property for cover image'
                },
                {
                    type: 'dropdown',
                    key: 'imageFit',
                    displayName: 'Image fit',
                    default: 'contain',
                    options: {
                        contain: 'Contain',
                        cover: 'Cover'
                    }
                },
                {
                    type: 'slider',
                    key: 'aspectRatio',
                    displayName: 'Aspect ratio',
                    min: 0.25,
                    max: 2.5,
                    step: 0.25,
                    default: 1
                }
            ]
        }
    ]
}
