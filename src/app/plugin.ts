import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS } from './types/plugin-settings.intf'
import type { PluginSettings } from './types/plugin-settings.intf'
import { BookshelfPluginSettingTab } from './settings/settings-tab'
import { log } from '../utils/log'
import { produce } from 'immer'
import type { Draft } from 'immer'
import { BookshelfView, BOOKSHELF_VIEW_TYPE } from './view/bookshelf-view'
import { getBookshelfViewOptions } from './view/view-options'
import { registerWhatsNewView } from './whats-new'

// TODO: Rename this class to match your plugin name (e.g., MyAwesomePlugin)
export class BookshelfPlugin extends Plugin {
    /**
     * The plugin settings are immutable
     */
    override settings: PluginSettings = produce(DEFAULT_SETTINGS, () => DEFAULT_SETTINGS)

    /**
     * Executed as soon as the plugin loads
     */
    override async onload() {
        // Must run before anything can call saveData (fresh-install detection)
        registerWhatsNewView(this)
        log('Initializing', 'debug')
        await this.loadSettings()

        // Register the Bookshelf Bases view
        this.registerBookshelfView()

        // Add a settings screen for the plugin
        this.addSettingTab(new BookshelfPluginSettingTab(this.app, this))
    }

    override onunload() {}

    /**
     * Register the Bookshelf view for Bases
     */
    private registerBookshelfView(): void {
        const registered = this.registerBasesView(BOOKSHELF_VIEW_TYPE, {
            name: 'Bookshelf',
            icon: 'book-open',
            factory: (controller, containerEl) => new BookshelfView(controller, containerEl, this),
            options: getBookshelfViewOptions
        })

        if (registered) {
            log('Bookshelf view registered successfully', 'debug')
        } else {
            log('Failed to register Bookshelf view - Bases feature may not be enabled', 'warn')
        }
    }

    /**
     * Load the plugin settings
     */
    async loadSettings() {
        log('Loading settings', 'debug')
        let loadedSettings = (await this.loadData()) as PluginSettings

        if (!loadedSettings) {
            log('Using default settings', 'debug')
            loadedSettings = produce(DEFAULT_SETTINGS, () => DEFAULT_SETTINGS)
            return
        }

        let needToSaveSettings = false

        this.settings = produce(this.settings, (draft: Draft<PluginSettings>) => {
            // Strict comparison: loadData can return anything (older versions,
            // hand-edited data.json) — a truthy non-boolean like "false" must
            // not reach a boolean field.
            if (typeof loadedSettings.enabled === 'boolean') {
                draft.enabled = loadedSettings.enabled
            } else {
                log('The loaded settings miss the [enabled] property', 'debug')
                needToSaveSettings = true
            }
        })

        log(`Settings loaded`, 'debug', loadedSettings)

        if (needToSaveSettings) {
            void this.saveSettings()
        }
    }

    /**
     * Apply a mutation to the settings (via immer) and persist the result.
     * Persist-then-commit: memory is swapped only after saveData() succeeds,
     * so the declarative tab's rejection-based rollback reads the on-disk
     * truth rather than an optimistic mutation that never landed.
     */
    /** Serializes settings writes; see updateSettings. */
    private settingsWriteChain: Promise<void> = Promise.resolve()

    updateSettings(mutator: (draft: Draft<PluginSettings>) => void): Promise<void> {
        // Serialized persist-then-commit: writes queue and each mutation
        // derives from the previous COMMITTED state — overlapping calls would
        // otherwise produce from the same base across the save await and
        // silently drop the earlier edit.
        const run = async (): Promise<void> => {
            const next = produce(this.settings, mutator)
            await this.saveData(next)
            this.settings = next
        }
        const p = this.settingsWriteChain.then(run, run)
        this.settingsWriteChain = p.catch(() => {})
        return p
    }

    /**
     * Save the plugin settings
     */
    async saveSettings() {
        log('Saving settings', 'debug', this.settings)
        await this.saveData(this.settings)
        log('Settings saved', 'debug', this.settings)
    }
}
