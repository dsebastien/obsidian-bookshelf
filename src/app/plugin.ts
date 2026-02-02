import { Plugin } from 'obsidian'
import { DEFAULT_SETTINGS } from './types/plugin-settings.intf'
import type { PluginSettings } from './types/plugin-settings.intf'
import { BookshelfPluginSettingTab } from './settings/settings-tab'
import { log } from '../utils/log'
import { produce } from 'immer'
import type { Draft } from 'immer'
import { BookshelfView, BOOKSHELF_VIEW_TYPE } from './view/bookshelf-view'
import { getBookshelfViewOptions } from './view/view-options'

// TODO: Rename this class to match your plugin name (e.g., MyAwesomePlugin)
export class BookshelfPlugin extends Plugin {
    /**
     * The plugin settings are immutable
     */
    settings: PluginSettings = produce(DEFAULT_SETTINGS, () => DEFAULT_SETTINGS)

    /**
     * Executed as soon as the plugin loads
     */
    override async onload() {
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
            if (loadedSettings.enabled) {
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
     * Save the plugin settings
     */
    async saveSettings() {
        log('Saving settings', 'debug', this.settings)
        await this.saveData(this.settings)
        log('Settings saved', 'debug', this.settings)
    }
}
