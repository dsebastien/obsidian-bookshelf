import { BasesView, Menu } from 'obsidian'
import type { QueryController, BasesEntry, BasesEntryGroup } from 'obsidian'
import type { MyPlugin } from '../plugin'

// Type declarations are loaded from src/app/types/bases.d.ts

export const BOOKSHELF_VIEW_TYPE = 'bookshelf'

/** Reading status values we recognize */
type ReadingStatus = 'reading' | 'want-to-read' | 'finished'

/** Status display configuration */
const STATUS_CONFIG: Record<ReadingStatus | 'unknown', { label: string; icon: string }> = {
    reading: { label: '📖 Currently Reading', icon: '📖' },
    'want-to-read': { label: '📚 Want to Read', icon: '📚' },
    finished: { label: '✅ Finished', icon: '✅' },
    unknown: { label: '📕 Uncategorized', icon: '📕' }
}

/** Order for displaying status groups */
const STATUS_ORDER: (ReadingStatus | 'unknown')[] = [
    'reading',
    'want-to-read',
    'finished',
    'unknown'
]

export class BookshelfView extends BasesView {
    type = BOOKSHELF_VIEW_TYPE

    private containerEl: HTMLElement

    constructor(controller: QueryController, scrollEl: HTMLElement, _plugin: MyPlugin) {
        super(controller)
        // Plugin reference available via _plugin if needed in future
        this.containerEl = scrollEl.createDiv({ cls: 'bookshelf-container' })
    }

    /**
     * Called when data changes - main render logic
     */
    override onDataUpdated(): void {
        this.containerEl.empty()

        const entries = this.data.data
        const groups = this.data.groupedData

        // Get configuration
        const shelfHeight = (this.config.get('shelfHeight') as number) ?? 180
        const bookWidth = (this.config.get('bookWidth') as number) ?? 100
        const showTitles = (this.config.get('showTitles') as boolean) ?? true
        const showAuthors = (this.config.get('showAuthors') as boolean) ?? false
        const showRatings = (this.config.get('showRatings') as boolean) ?? true
        const groupByStatus = (this.config.get('groupByStatus') as boolean) ?? true
        const showEmptyGroups = (this.config.get('showEmptyGroups') as boolean) ?? false
        const showShelfWood = (this.config.get('showShelfWood') as boolean) ?? true
        const bookGap = (this.config.get('bookGap') as number) ?? 8

        // Set CSS variables for sizing
        this.containerEl.style.setProperty('--bookshelf-height', `${shelfHeight}px`)
        this.containerEl.style.setProperty('--book-width', `${bookWidth}px`)
        this.containerEl.style.setProperty('--book-gap', `${bookGap}px`)

        // Handle empty state
        if (entries.length === 0) {
            this.renderEmptyState()
            return
        }

        // Check if data is already grouped by Bases
        if (groups && groups.length > 0) {
            this.renderBasesGroups(groups, {
                shelfHeight,
                showTitles,
                showAuthors,
                showRatings,
                showShelfWood
            })
        } else if (groupByStatus) {
            // Group by status ourselves
            this.renderStatusGroups(entries, {
                shelfHeight,
                showTitles,
                showAuthors,
                showRatings,
                showShelfWood,
                showEmptyGroups
            })
        } else {
            // Render as a single shelf
            this.renderShelf(entries, 'All Books', {
                shelfHeight,
                showTitles,
                showAuthors,
                showRatings,
                showShelfWood
            })
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
            shelfHeight: number
            showTitles: boolean
            showAuthors: boolean
            showRatings: boolean
            showShelfWood: boolean
        }
    ): void {
        for (const group of groups) {
            // Access group properties with type assertions for Bases API compatibility
            const groupValue = (group as { value?: { toString(): string } }).value
            const groupData = (group as { data?: BasesEntry[] }).data ?? []
            const label = groupValue?.toString() ?? 'Ungrouped'
            this.renderShelf(groupData, label, options)
        }
    }

    /**
     * Group entries by status and render each as a shelf
     */
    private renderStatusGroups(
        entries: BasesEntry[],
        options: {
            shelfHeight: number
            showTitles: boolean
            showAuthors: boolean
            showRatings: boolean
            showShelfWood: boolean
            showEmptyGroups: boolean
        }
    ): void {
        // Group entries by status
        const byStatus = new Map<ReadingStatus | 'unknown', BasesEntry[]>()

        for (const entry of entries) {
            const statusValue = entry.getValue('note.status')
            const status = this.normalizeStatus(statusValue?.toString() ?? '')
            const list = byStatus.get(status) ?? []
            list.push(entry)
            byStatus.set(status, list)
        }

        // Render in order
        for (const status of STATUS_ORDER) {
            const books = byStatus.get(status) ?? []
            if (books.length === 0 && !options.showEmptyGroups) {
                continue
            }

            const config = STATUS_CONFIG[status]
            this.renderShelf(books, config.label, options)
        }
    }

    /**
     * Normalize status string to known status type
     */
    private normalizeStatus(status: string): ReadingStatus | 'unknown' {
        const normalized = status.toLowerCase().trim()

        if (normalized === 'reading' || normalized === 'currently reading') {
            return 'reading'
        }
        if (
            normalized === 'want-to-read' ||
            normalized === 'want to read' ||
            normalized === 'to-read' ||
            normalized === 'to read' ||
            normalized === 'tbr'
        ) {
            return 'want-to-read'
        }
        if (normalized === 'finished' || normalized === 'read' || normalized === 'completed') {
            return 'finished'
        }

        return 'unknown'
    }

    /**
     * Render a single bookshelf with books
     */
    private renderShelf(
        entries: BasesEntry[],
        label: string,
        options: {
            shelfHeight: number
            showTitles: boolean
            showAuthors: boolean
            showRatings: boolean
            showShelfWood: boolean
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
            cls: `bookshelf-shelf ${options.showShelfWood ? 'bookshelf-shelf--wood' : ''}`
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
            showTitles: boolean
            showAuthors: boolean
            showRatings: boolean
        }
    ): void {
        const bookEl = container.createDiv({ cls: 'bookshelf-book' })

        // Get book properties
        const title = entry.getValue('note.title')?.toString() ?? entry.file.basename
        const author = entry.getValue('note.author')?.toString() ?? ''
        const cover = entry.getValue('note.cover')?.toString() ?? ''
        const ratingValue = entry.getValue('note.rating')
        const rating = ratingValue ? parseFloat(ratingValue.toString()) : 0

        // Book cover/spine
        const coverEl = bookEl.createDiv({ cls: 'bookshelf-book-cover' })

        if (cover) {
            // Has cover image
            coverEl.addClass('bookshelf-book-cover--image')
            coverEl.style.backgroundImage = `url('${cover}')`
        } else {
            // Generate a colored spine
            coverEl.addClass('bookshelf-book-cover--spine')
            coverEl.style.backgroundColor = this.generateSpineColor(title)

            // Add vertical title on spine
            const spineTitle = coverEl.createDiv({ cls: 'bookshelf-spine-title' })
            spineTitle.setText(this.truncateTitle(title, 20))
        }

        // Book info overlay/below
        const infoEl = bookEl.createDiv({ cls: 'bookshelf-book-info' })

        if (options.showTitles) {
            infoEl.createDiv({
                cls: 'bookshelf-book-title',
                text: this.truncateTitle(title, 30),
                title: title
            })
        }

        if (options.showAuthors && author) {
            infoEl.createDiv({
                cls: 'bookshelf-book-author',
                text: author,
                title: author
            })
        }

        if (options.showRatings && rating > 0) {
            const ratingEl = infoEl.createDiv({ cls: 'bookshelf-book-rating' })
            ratingEl.setText(this.renderStars(rating))
        }

        // Click to open file
        bookEl.addEventListener('click', () => {
            void this.openFile(entry)
        })

        // Right-click context menu
        bookEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            this.showContextMenu(e, entry)
        })
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
     * Render star rating
     */
    private renderStars(rating: number): string {
        const fullStars = Math.floor(rating)
        const halfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
    }

    /**
     * Open a file when user clicks on a book
     */
    private async openFile(entry: BasesEntry): Promise<void> {
        await this.app.workspace.getLeaf().openFile(entry.file)
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
