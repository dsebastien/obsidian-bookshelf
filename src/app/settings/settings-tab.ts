import { App, PluginSettingTab, Setting } from 'obsidian'
import type BookshelfPlugin from '../../main'
import { BUY_ME_A_COFFEE_BADGE_DATA_URL } from '../assets/buy-me-a-coffee'
import { renderSupportSection } from '../ui/support-links'

// TODO: Rename this class to match your plugin name (e.g., MyAwesomePluginSettingTab)
export class BookshelfPluginSettingTab extends PluginSettingTab {
    plugin: BookshelfPlugin

    constructor(app: App, plugin: BookshelfPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        const { containerEl } = this
        containerEl.empty()

        this.renderFollowButton(containerEl)
        this.renderSupportHeader(containerEl)
    }

    // TODO: Adapt this or remove
    renderFollowButton(containerEl: HTMLElement) {
        new Setting(containerEl)
            .setName('Follow me on X')
            .setDesc('Sébastien Dubois (@dSebastien)')
            .addButton((button) => {
                button.setCta()
                button.setButtonText('Follow me on X').onClick(() => {
                    window.open('https://x.com/dSebastien')
                })
            })
    }

    // TODO: Adapt this or remove
    renderSupportHeader(containerEl: HTMLElement) {
        renderSupportSection(containerEl, (el) => {
            this.renderBuyMeACoffeeBadge(el)
        })
    }

    // TODO: Adapt this or remove
    renderBuyMeACoffeeBadge(contentEl: HTMLElement | DocumentFragment, width = 175) {
        const linkEl = contentEl.createEl('a', {
            href: 'https://www.buymeacoffee.com/dsebastien'
        })
        const imgEl = linkEl.createEl('img')
        imgEl.src = BUY_ME_A_COFFEE_BADGE_DATA_URL
        imgEl.alt = 'Buy me a coffee'
        imgEl.width = width
    }
}
