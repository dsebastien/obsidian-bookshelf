import { BasesView, ListValue, Menu, NullValue, TFile } from 'obsidian'
import type { QueryController, BasesEntry, BasesEntryGroup } from 'obsidian'
import type { BookshelfPlugin } from '../plugin'
import { parseCoverValue, toCssUrl } from './cover-url'
import {
    classicSpineColor,
    DEFAULT_AUTHOR_PROPERTIES,
    coverAriaLabel,
    formatAuthor,
    longestWordLength,
    normalizeDefaultCover,
    normalizeFoil,
    pickCoverColor,
    pickLabelColor,
    resolveCoverStyle,
    spineAuthor
} from './default-cover'
import type { DefaultCoverOption } from './default-cover'

// Type declarations are loaded from src/app/types/bases.d.ts

export const BOOKSHELF_VIEW_TYPE = 'bookshelf'

interface RenderOptions {
    coverProperty: string | null
    authorProperty: string | null
    defaultCover: DefaultCoverOption
    visibleProperties: string[]
}

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

        // Decoration settings
        const showShelf = (this.config.get('showShelf') as boolean) ?? true
        const showShadows = (this.config.get('showShadows') as boolean) ?? true

        // Cover settings
        const coverProperty = this.config.getAsPropertyId('coverProperty')
        const imageFit = (this.config.get('imageFit') as string) ?? 'contain'
        const aspectRatio = (this.config.get('aspectRatio') as number) ?? 1
        const defaultCover = normalizeDefaultCover(this.config.get('defaultCover'))
        const coverFoil = normalizeFoil(this.config.get('coverFoil'))
        const authorProperty = this.config.getAsPropertyId('authorProperty')

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
        this.containerEl.dataset['shelfDecorations'] = showShelf ? 'on' : 'off'
        this.containerEl.dataset['bookShadows'] = showShadows ? 'on' : 'off'
        this.containerEl.dataset['coverFoil'] = coverFoil

        // Handle empty state
        if (entries.length === 0) {
            this.renderEmptyState()
            return
        }

        const renderOptions: RenderOptions = {
            coverProperty,
            authorProperty,
            defaultCover,
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
    private renderBasesGroups(groups: BasesEntryGroup[], options: RenderOptions): void {
        for (const group of groups) {
            const groupEntries = group.entries ?? []
            const label = group.key?.toString() ?? 'Ungrouped'
            this.renderShelf(groupEntries, label, options)
        }
    }

    /**
     * Render a single bookshelf with books
     */
    private renderShelf(entries: BasesEntry[], label: string, options: RenderOptions): void {
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
    private renderBook(container: HTMLElement, entry: BasesEntry, options: RenderOptions): void {
        const bookEl = container.createDiv({ cls: 'bookshelf-book' })

        // Get title for spine (fallback to filename)
        const title = entry.getValue('note.title')?.toString() ?? entry.file.basename

        // Get cover from configured property or fall back to 'note.cover'
        const coverPropId = options.coverProperty ?? 'note.cover'
        const rawCoverValue = entry.getValue(coverPropId)
        // Skip if property doesn't exist or is null
        const coverValue =
            !rawCoverValue || rawCoverValue instanceof NullValue ? '' : rawCoverValue.toString()
        const coverUrl = this.resolveCoverUrl(coverValue, entry.file.path)

        const author = this.readAuthor(entry, options.authorProperty)

        // Book cover
        const coverEl = bookEl.createDiv({
            cls: 'bookshelf-book-cover',
            attr: { 'aria-label': coverAriaLabel(title, author) }
        })

        if (coverUrl) {
            // Has cover image
            coverEl.addClass('bookshelf-book-cover--image')
            coverEl.style.backgroundImage = toCssUrl(coverUrl)
            // An image that does not load would leave an empty block: draw the default cover instead.
            this.onCoverImageError(coverUrl, () => {
                if (!coverEl.isConnected) return
                coverEl.removeClass('bookshelf-book-cover--image')
                coverEl.style.removeProperty('background-image')
                this.renderDefaultCover(coverEl, title, author, options.defaultCover)
            })
        } else {
            this.renderDefaultCover(coverEl, title, author, options.defaultCover)
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

            // Check if this is a rating property
            const isRating =
                propId.toLowerCase().includes('rating') ||
                displayName.toLowerCase().includes('rating')

            // Always render property element to maintain consistent block height
            const propClasses = ['bookshelf-book-property']
            if (isRating) {
                propClasses.push('bookshelf-book-property--rating')
            }

            const propEl = infoEl.createDiv({
                cls: propClasses.join(' '),
                title: valueStr ? `${displayName}: ${valueStr}` : displayName
            })

            if (valueStr) {
                // Render property with clickable wikilinks
                this.renderPropertyValue(propEl, valueStr, entry.file.path)
            } else {
                // Use non-breaking space to preserve line height for empty values
                propEl.textContent = '\u00A0'
            }
        }
    }

    /**
     * Render a property value with clickable wikilinks using Obsidian's standard link handling
     */
    private renderPropertyValue(container: HTMLElement, value: string, sourcePath: string): void {
        // Regex to match wikilinks: [[link]] or [[link|display]]
        const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

        let lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = wikiLinkRegex.exec(value)) !== null) {
            // Add text before the link
            if (match.index > lastIndex) {
                container.appendText(value.slice(lastIndex, match.index))
            }

            // Create clickable link using Obsidian's standard internal-link format
            const linkPath = match[1] ?? ''
            const displayText = match[2] ?? linkPath

            const linkEl = container.createEl('a', {
                cls: 'internal-link',
                text: displayText,
                attr: {
                    'data-href': linkPath,
                    'href': linkPath,
                    'target': '_blank',
                    'rel': 'noopener'
                }
            })

            // Use Obsidian's openLinkText API for proper link handling
            linkEl.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                void this.app.workspace.openLinkText(
                    linkPath,
                    sourcePath,
                    e.ctrlKey || e.metaKey ? 'tab' : false
                )
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
     * Resolve cover value to a usable URL.
     * Handles external URLs, vault paths, bare file names, wikilinks and markdown images.
     * Vault references go through the vault, then the metadata cache (same rules as links),
     * so a bare name or a path with the wrong casing still finds the file.
     * Returns '' when a vault file cannot be found, so the spine is shown instead of a blank cover.
     */
    private resolveCoverUrl(cover: string, sourcePath: string): string {
        const ref = parseCoverValue(cover)
        if (ref.kind === 'none') return ''
        if (ref.kind === 'url') return ref.url

        const { vault, metadataCache } = this.app
        const byPath = vault.getAbstractFileByPath(ref.linkpath)
        const file =
            byPath instanceof TFile
                ? byPath
                : metadataCache.getFirstLinkpathDest(ref.linkpath, sourcePath)
        return file ? vault.getResourcePath(file) : ''
    }

    /**
     * Read the author for the default cover. A list shows its first value
     * (plus "et al."), and wikilinks show their display text.
     * Without an "Author property", try `author`, then `authors`.
     */
    private readAuthor(entry: BasesEntry, authorProperty: string | null): string {
        for (const propId of authorProperty ? [authorProperty] : DEFAULT_AUTHOR_PROPERTIES) {
            const author = this.readAuthorValue(entry, propId)
            if (author) return author
        }
        return ''
    }

    private readAuthorValue(entry: BasesEntry, propId: string): string {
        const value = entry.getValue(propId)
        if (!value || value instanceof NullValue) return ''
        if (value instanceof ListValue) {
            const items: string[] = []
            for (let i = 0; i < value.length(); i++) {
                items.push(value.get(i).toString())
            }
            return formatAuthor(items)
        }
        return formatAuthor([value.toString()])
    }

    /**
     * Call `onError` when the image at `url` cannot be loaded (404, offline, bad file).
     * The browser cache serves the request, so the image is not downloaded twice.
     */
    private onCoverImageError(url: string, onError: () => void): void {
        const probe = new Image()
        probe.addEventListener('error', onError, { once: true })
        probe.src = url
    }

    /**
     * Draw the cover of a book that has no usable image.
     * `classic` is the colored spine with a vertical title. The other styles
     * draw a bound cover with the title (and author) in foil lettering.
     * The stylesheet switches to a spine layout when the cover is narrow.
     */
    private renderDefaultCover(
        coverEl: HTMLElement,
        title: string,
        author: string,
        option: DefaultCoverOption
    ): void {
        const style = resolveCoverStyle(option, title)

        if (style === 'classic') {
            coverEl.addClass('bookshelf-book-cover--spine')
            coverEl.style.backgroundColor = classicSpineColor(title)
            const spineTitle = coverEl.createDiv({ cls: 'bookshelf-spine-title' })
            spineTitle.setText(this.truncateTitle(title, 25))
            return
        }

        coverEl.addClass('bookshelf-book-cover--default')
        const art = coverEl.createDiv({
            cls: 'bookshelf-default-cover',
            attr: { 'data-cover-style': style }
        })
        art.style.setProperty('--cover-bg', pickCoverColor(style, title))
        art.style.setProperty('--cover-label-bg', pickLabelColor(title))
        art.style.setProperty('--cover-longest-word', String(longestWordLength(title)))

        // Front face
        const face = art.createDiv({ cls: 'bookshelf-cover-face' })
        face.createDiv({ cls: 'bookshelf-cover-frame' })
        const content = face.createDiv({ cls: 'bookshelf-cover-content' })
        const block =
            style === 'leather' ? content.createDiv({ cls: 'bookshelf-cover-label' }) : content
        if (style === 'library') block.createDiv({ cls: 'bookshelf-cover-rule' })
        block
            .createDiv({ cls: 'bookshelf-cover-title' })
            .createSpan({ cls: 'bookshelf-cover-foil', text: title })
        if (style === 'library') block.createDiv({ cls: 'bookshelf-cover-rule' })
        if (author) {
            if (style === 'cloth') block.createDiv({ cls: 'bookshelf-cover-ornament' })
            content
                .createDiv({ cls: 'bookshelf-cover-author' })
                .createSpan({ cls: 'bookshelf-cover-foil', text: author })
        }

        // Spine (shown instead of the face when the cover is narrow)
        const spine = art.createDiv({ cls: 'bookshelf-cover-spine' })
        spine.createDiv({ cls: 'bookshelf-cover-band' })
        const spineText = spine.createDiv({ cls: 'bookshelf-cover-spine-text' })
        spineText.createSpan({ cls: 'bookshelf-cover-foil', text: title })
        const shortAuthor = spineAuthor(title, author)
        if (shortAuthor) {
            spineText.createSpan({ cls: 'bookshelf-cover-foil', text: '  ·  ' })
            spineText.createSpan({
                cls: 'bookshelf-cover-foil bookshelf-cover-spine-author',
                text: shortAuthor
            })
        }
        spine.createDiv({ cls: 'bookshelf-cover-band' })
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
