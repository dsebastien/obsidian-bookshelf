/**
 * Test setup file that mocks the 'obsidian' module.
 * The obsidian package is types-only and has no runtime code,
 * so we need to provide mock implementations for tests.
 */
import { mock } from 'bun:test'

// Mock the obsidian module (fire-and-forget, no need to await)
void mock.module('obsidian', () => ({
    Notice: class Notice {
        constructor(_message: string, _timeout?: number) {
            // No-op for tests
        }
    },
    // These are only used as types, but we provide empty implementations
    // in case they're ever accessed at runtime
    App: class App {},
    TFile: class TFile {},
    Plugin: class Plugin {},
    // Reached from plugin.ts: the What's new view extends ItemView and
    // renders with MarkdownRenderer; the Bookshelf view extends BasesView
    // and imports Menu and NullValue.
    ItemView: class ItemView {},
    MarkdownRenderer: { render: async () => {} },
    BasesView: class BasesView {},
    Menu: class Menu {},
    NullValue: class NullValue {},
    PluginSettingTab: class PluginSettingTab {},
    Setting: class Setting {},
    MarkdownView: class MarkdownView {},
    TAbstractFile: class TAbstractFile {},
    TFolder: class TFolder {},
    AbstractInputSuggest: class AbstractInputSuggest {},
    SearchComponent: class SearchComponent {},
    debounce: (fn: (...args: unknown[]) => unknown) => fn,
    setIcon: () => {}
}))
