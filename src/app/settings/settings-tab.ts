import { PluginSettingTab } from 'obsidian'
import type { App, SettingDefinitionItem } from 'obsidian'
import type BookshelfPlugin from '../../main'
import { BUY_ME_A_COFFEE_BADGE_DATA_URL } from '../assets/buy-me-a-coffee'
import { BUY_ME_A_COFFEE_URL, renderSupportSection } from '../ui/support-links'

/**
 * Settings tab, declared rather than rendered (Obsidian 1.13+).
 *
 * `getSettingDefinitions()` REPLACES `display()`: when it returns a non-empty
 * array, `display()` is never called. There is no partial adoption — the whole
 * settings UI is declarative, or none of it. In exchange, Obsidian owns
 * navigation, focus and ARIA, and every declared `name`/`desc` is indexed by
 * the settings search.
 *
 * Rules that each cost a shipped bug the first time they were broken
 * (see AGENTS.md "Declarative settings" for the full list):
 *
 * - A `render:` hook renders the ROW. Write into `setting.settingEl` only;
 *   anything written outside it (e.g. `group.listEl`) is the framework's to
 *   discard, and the control simply does not appear.
 * - `defaultValue` is the fallback for a RESOLVER returning undefined/null,
 *   NOT for a cleared input. Do not declare it on numeric controls; let a
 *   `validate` bounds-check refuse the cleared value inline.
 * - A row `action:` fires on the whole row, not on a button. Destructive
 *   actions need their own confirmation modal.
 * - `setControlValue` MUST reject on failure. Resolving tells the framework
 *   the write landed, so the pane keeps showing a value that was never stored.
 */
// TODO: Rename this class to match your plugin name (e.g., MyAwesomePluginSettingTab)
export class BookshelfPluginSettingTab extends PluginSettingTab {
    plugin: BookshelfPlugin

    constructor(app: App, plugin: BookshelfPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    override getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            // TODO: Adapt this or remove
            {
                name: 'Follow me on X',
                desc: 'Sébastien Dubois (@dSebastien)',
                searchable: false,
                action: () => {
                    window.open('https://x.com/dSebastien')
                }
            },
            // TODO: Adapt this or remove
            {
                type: 'group',
                // No heading: renderSupportSection draws its own.
                items: [
                    {
                        name: 'Support',
                        // Not a setting — keep it out of the settings search.
                        searchable: false,
                        render: (setting): void => {
                            // Render INSIDE the row (settingEl), never into
                            // group.listEl — see the class docs above.
                            setting.infoEl.remove() // the section draws its own headings
                            renderSupportSection(setting.settingEl, (el) => {
                                this.renderBuyMeACoffeeBadge(el)
                            })
                        }
                    }
                ]
            }
        ]
    }

    // No control definitions -> no getControlValue/setControlValue bridge.
    // When a real setting is added, reinstate both (see the template) and
    // remember: setControlValue must REJECT on failure.

    // TODO: Adapt this or remove
    renderBuyMeACoffeeBadge(contentEl: HTMLElement | DocumentFragment, width = 175) {
        const linkEl = contentEl.createEl('a', {
            href: BUY_ME_A_COFFEE_URL
        })
        const imgEl = linkEl.createEl('img')
        imgEl.src = BUY_ME_A_COFFEE_BADGE_DATA_URL
        imgEl.alt = 'Buy me a coffee'
        imgEl.width = width
    }
}
