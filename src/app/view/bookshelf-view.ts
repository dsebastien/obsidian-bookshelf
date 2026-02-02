import { BasesView, Menu, NullValue } from 'obsidian'
import type { QueryController, BasesEntry, BasesEntryGroup } from 'obsidian'
import type { BookshelfPlugin } from '../plugin'

// Type declarations are loaded from src/app/types/bases.d.ts

export const BOOKSHELF_VIEW_TYPE = 'bookshelf'

export class BookshelfView extends BasesView {
    type = BOOKSHELF_VIEW_TYPE

    private containerEl: HTMLElement

    constructor(controller: QueryController, scrollEl: HTMLElement, _plugin: BookshelfPlugin) {
        super(controller)
        // Plugin reference available via _plugin if needed in future
        this.containerEl = scrollEl.createDiv({ cls: 'bookshelf-container' })
    }

    /**
     * Called when data changes - main render logic
     * Follows Base groupings if present, otherwise renders all books on a single shelf
     */
    override onDataUpdated(): void {
        this.containerEl.empty()

        const entries = this.data.data
        const groups = this.data.groupedData

        // Get configuration
        const cardSize = (this.config.get('cardSize') as number) ?? 150
        const bookGap = (this.config.get('bookGap') as number) ?? 20

        // Shelf settings
        const shelfTexture = (this.config.get('shelfTexture') as string) ?? 'oak'

        // Cover settings
        const coverProperty = this.config.getAsPropertyId('coverProperty')
        const imageFit = (this.config.get('imageFit') as string) ?? 'contain'
        const aspectRatio = (this.config.get('aspectRatio') as number) ?? 1

        // Get visible properties from Base configuration
        const visibleProperties = this.config.getOrder()

        // Calculate book dimensions based on card size and aspect ratio
        const bookWidth = cardSize
        const bookHeight = Math.round(cardSize / aspectRatio)

        // Set CSS variables for sizing
        this.containerEl.style.setProperty('--book-width', `${bookWidth}px`)
        this.containerEl.style.setProperty('--book-height', `${bookHeight}px`)
        this.containerEl.style.setProperty('--book-gap', `${bookGap}px`)
        this.containerEl.style.setProperty('--image-fit', imageFit)
        this.containerEl.dataset['shelfTexture'] = shelfTexture

        // Handle empty state
        if (entries.length === 0) {
            this.renderEmptyState()
            return
        }

        const renderOptions = {
            coverProperty,
            visibleProperties
        }

        // Use Base groupings if present, otherwise render all books
        if (groups && groups.length > 0) {
            this.renderBasesGroups(groups, renderOptions)
        } else {
            this.renderShelf(entries, 'All Books', renderOptions)
        }
    }

    /**
     * Render empty state when no books match
     */
    private renderEmptyState(): void {
        const emptyEl = this.containerEl.createDiv({ cls: 'bookshelf-empty' })
        emptyEl.createDiv({ cls: 'bookshelf-empty-icon', text: '📚' })
        emptyEl.createDiv({
            cls: 'bookshelf-empty-text',
            text: 'No books found'
        })
        emptyEl.createDiv({
            cls: 'bookshelf-empty-hint',
            text: 'Add notes with book frontmatter properties to see them here'
        })
    }

    /**
     * Render groups that come from Bases groupBy configuration
     */
    private renderBasesGroups(
        groups: BasesEntryGroup[],
        options: {
            coverProperty: string | null
            visibleProperties: string[]
        }
    ): void {
        for (const group of groups) {
            const groupEntries = group.entries ?? []
            const label = group.key?.toString() ?? 'Ungrouped'
            this.renderShelf(groupEntries, label, options)
        }
    }

    /**
     * Render a single bookshelf with books
     */
    private renderShelf(
        entries: BasesEntry[],
        label: string,
        options: {
            coverProperty: string | null
            visibleProperties: string[]
        }
    ): void {
        const shelfSection = this.containerEl.createDiv({ cls: 'bookshelf-section' })

        // Shelf header
        const headerEl = shelfSection.createDiv({ cls: 'bookshelf-header' })
        headerEl.createSpan({ cls: 'bookshelf-header-label', text: label })
        headerEl.createSpan({
            cls: 'bookshelf-header-count',
            text: `${entries.length} book${entries.length !== 1 ? 's' : ''}`
        })

        // Shelf container
        const shelfEl = shelfSection.createDiv({
            cls: 'bookshelf-shelf'
        })

        // Books row
        const booksRow = shelfEl.createDiv({ cls: 'bookshelf-books' })

        for (const entry of entries) {
            this.renderBook(booksRow, entry, options)
        }

        // Empty shelf message
        if (entries.length === 0) {
            booksRow.createDiv({
                cls: 'bookshelf-shelf-empty',
                text: 'No books on this shelf'
            })
        }
    }

    /**
     * Render a single book on the shelf
     */
    private renderBook(
        container: HTMLElement,
        entry: BasesEntry,
        options: {
            coverProperty: string | null
            visibleProperties: string[]
        }
    ): void {
        const bookEl = container.createDiv({ cls: 'bookshelf-book' })

        // Get title for spine (fallback to filename)
        const title = entry.getValue('note.title')?.toString() ?? entry.file.basename

        // Get cover from configured property or fall back to 'note.cover'
        const coverPropId = options.coverProperty ?? 'note.cover'
        const coverValue = entry.getValue(coverPropId)?.toString() ?? ''
        const coverUrl = this.resolveCoverUrl(coverValue)

        // Book cover/spine
        const coverEl = bookEl.createDiv({ cls: 'bookshelf-book-cover' })

        if (coverUrl) {
            // Has cover image
            coverEl.addClass('bookshelf-book-cover--image')
            coverEl.style.backgroundImage = `url('${coverUrl}')`
        } else {
            // Generate a colored spine
            coverEl.addClass('bookshelf-book-cover--spine')
            coverEl.style.backgroundColor = this.generateSpineColor(title)

            // Add vertical title on spine
            const spineTitle = coverEl.createDiv({ cls: 'bookshelf-spine-title' })
            spineTitle.setText(this.truncateTitle(title, 25))
        }

        // Click on cover to open file (ctrl/cmd+click opens in new tab)
        coverEl.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                void this.openFileInNewTab(entry)
            } else {
                void this.openFile(entry)
            }
        })

        // Right-click context menu on cover
        coverEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            this.showContextMenu(e, entry)
        })

        // Book info - render visible properties from Base configuration
        const infoEl = bookEl.createDiv({ cls: 'bookshelf-book-info' })

        for (const propId of options.visibleProperties) {
            // Skip the cover property - it's already shown as the image
            if (propId === options.coverProperty) continue

            const value = entry.getValue(propId)
            // Handle null values as empty string
            const valueStr = !value || value instanceof NullValue ? '' : value.toString()

            const displayName = this.config.getDisplayName(propId)

            // Always render property element to maintain consistent block height
            const propEl = infoEl.createDiv({
                cls: 'bookshelf-book-property',
                title: valueStr ? `${displayName}: ${valueStr}` : displayName
            })

            if (valueStr) {
                // Render property with clickable wikilinks
                this.renderPropertyValue(propEl, valueStr)
            } else {
                // Use non-breaking space to preserve line height for empty values
                propEl.textContent = '\u00A0'
            }
        }
    }

    /**
     * Render a property value with clickable wikilinks
     */
    private renderPropertyValue(container: HTMLElement, value: string): void {
        // Regex to match wikilinks: [[link]] or [[link|display]]
        const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

        let lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = wikiLinkRegex.exec(value)) !== null) {
            // Add text before the link
            if (match.index > lastIndex) {
                container.appendText(value.slice(lastIndex, match.index))
            }

            // Create clickable link
            const linkPath = match[1] ?? ''
            const displayText = match[2] ?? linkPath

            const linkEl = container.createEl('a', {
                cls: 'bookshelf-link',
                text: displayText,
                href: linkPath
            })

            // Handle click
            linkEl.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                void this.openLink(linkPath, e.ctrlKey || e.metaKey)
            })

            lastIndex = match.index + match[0].length
        }

        // Add remaining text after last link
        if (lastIndex < value.length) {
            container.appendText(value.slice(lastIndex))
        }

        // If no links were found, just set the text
        if (lastIndex === 0) {
            container.setText(value)
        }
    }

    /**
     * Open an internal link
     */
    private async openLink(linkPath: string, newTab: boolean): Promise<void> {
        const file = this.app.metadataCache.getFirstLinkpathDest(linkPath, '')
        if (file) {
            if (newTab) {
                await this.app.workspace.getLeaf('tab').openFile(file)
            } else {
                await this.app.workspace.getLeaf().openFile(file)
            }
        }
    }

    /**
     * Resolve cover value to a usable URL
     * Handles both external URLs and vault-relative paths
     */
    private resolveCoverUrl(cover: string): string {
        if (!cover) return ''

        // Check if it's already a URL (http, https, data:)
        if (/^(https?:\/\/|data:)/i.test(cover)) {
            return cover
        }

        // Treat as vault-relative path - use Obsidian's resource path
        // Remove leading slash if present for consistency
        const normalizedPath = cover.startsWith('/') ? cover.slice(1) : cover
        return this.app.vault.adapter.getResourcePath(normalizedPath)
    }

    /**
     * Generate a deterministic color for a book spine based on title
     */
    private generateSpineColor(title: string): string {
        // Simple hash function
        let hash = 0
        for (let i = 0; i < title.length; i++) {
            const char = title.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
        }

        // Generate muted colors suitable for book spines
        const hue = Math.abs(hash) % 360
        const saturation = 30 + (Math.abs(hash >> 8) % 30) // 30-60%
        const lightness = 35 + (Math.abs(hash >> 16) % 20) // 35-55%

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }

    /**
     * Truncate title to max length
     */
    private truncateTitle(title: string, maxLength: number): string {
        if (title.length <= maxLength) return title
        return title.slice(0, maxLength - 1) + '…'
    }

    /**
     * Open a file when user clicks on a book
     */
    private async openFile(entry: BasesEntry): Promise<void> {
        await this.app.workspace.getLeaf().openFile(entry.file)
    }

    /**
     * Open a file in a new tab
     */
    private async openFileInNewTab(entry: BasesEntry): Promise<void> {
        await this.app.workspace.getLeaf('tab').openFile(entry.file)
    }

    /**
     * Show context menu for a book
     */
    private showContextMenu(event: MouseEvent, entry: BasesEntry): void {
        const menu = new Menu()

        menu.addItem((item) => {
            item.setTitle('Open')
                .setIcon('file')
                .onClick(() => {
                    void this.openFile(entry)
                })
        })

        menu.addItem((item) => {
            item.setTitle('Open in new tab')
                .setIcon('file-plus')
                .onClick(async () => {
                    await this.app.workspace.getLeaf('tab').openFile(entry.file)
                })
        })

        menu.addSeparator()

        menu.addItem((item) => {
            item.setTitle('Reveal in navigation')
                .setIcon('folder')
                .onClick(() => {
                    // @ts-expect-error - revealLeaf exists but not in types
                    void this.app.workspace.revealLeaf?.(entry.file)
                })
        })

        menu.showAtMouseEvent(event)
    }

    override onunload(): void {
        // Cleanup if needed
    }
}
