/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Type declarations for Obsidian Bases API
 * These types are not yet exported from the official obsidian package
 * Based on the Custom Base View Type Expert Prompt documentation
 */

import type { Component, TFile, Plugin } from 'obsidian'

declare module 'obsidian' {
    /**
     * Property ID format for Bases
     */
    type BasesPropertyType = 'note' | 'formula' | 'file'
    type BasesPropertyId = `${BasesPropertyType}.${string}`

    /**
     * Base class for property values
     */
    class Value {
        toString(): string
        isTruthy(): boolean
    }

    class BooleanValue extends Value {
        isTruthy(): boolean
    }

    class NumberValue extends Value {
        toString(): string
    }

    class DateValue extends Value {
        toString(): string
    }

    class StringValue extends Value {
        toString(): string
    }

    class NullValue extends Value {}

    class ListValue extends Value {
        length(): number
        get(index: number): Value | null
    }

    /**
     * A single entry (row/file) in a Base query result
     */
    interface BasesEntry {
        file: TFile
        getValue(propId: string): Value | null
    }

    /**
     * A group of entries when using groupBy
     * Note: Actual API uses 'entries' and 'key' properties
     */
    interface BasesEntryGroup {
        key: Value | null
        entries: BasesEntry[]
    }

    /**
     * Query results from Bases
     */
    interface BasesQueryResult {
        data: BasesEntry[]
        groupedData: BasesEntryGroup[] | null
        properties: BasesPropertyId[]
    }

    /**
     * Sort configuration
     */
    interface BasesSortConfig {
        property: BasesPropertyId
        direction: 'asc' | 'desc'
    }

    /**
     * View configuration accessor
     */
    interface BasesViewConfig {
        name: string
        get(key: string): unknown
        set(key: string, value: unknown): void
        getOrder(): BasesPropertyId[]
        getSort(): BasesSortConfig[]
        getDisplayName(propId: string): string
        getAsPropertyId(key: string): BasesPropertyId | null
    }

    /**
     * Query controller for executing queries
     */
    interface QueryController {
        // Marker interface for query execution context
        readonly _brand?: 'QueryController'
    }

    /**
     * View option types
     */
    interface ViewOptionBase {
        key?: string
        displayName: string
    }

    interface ViewOptionSlider extends ViewOptionBase {
        type: 'slider'
        key: string
        min: number
        max: number
        step: number
        default: number
    }

    interface ViewOptionDropdown extends ViewOptionBase {
        type: 'dropdown'
        key: string
        options: Record<string, string>
        default: string
    }

    interface ViewOptionProperty extends ViewOptionBase {
        type: 'property'
        key: string
        placeholder?: string
        filter?: (prop: string) => boolean
    }

    interface ViewOptionToggle extends ViewOptionBase {
        type: 'toggle'
        key: string
        default: boolean
    }

    interface ViewOptionText extends ViewOptionBase {
        type: 'text'
        key: string
        placeholder?: string
    }

    interface ViewOptionFormula extends ViewOptionBase {
        type: 'formula'
        key: string
    }

    interface ViewOptionGroup extends ViewOptionBase {
        type: 'group'
        items: ViewOption[]
    }

    type ViewOption =
        | ViewOptionSlider
        | ViewOptionDropdown
        | ViewOptionProperty
        | ViewOptionToggle
        | ViewOptionText
        | ViewOptionFormula
        | ViewOptionGroup

    /**
     * Registration options for a Bases view
     */
    interface BasesViewRegistration {
        name: string
        icon: string
        factory: (controller: QueryController, containerEl: HTMLElement) => BasesView
        options?: () => ViewOption[]
    }

    /**
     * Abstract base class for custom Bases views
     */
    abstract class BasesView extends Component {
        abstract type: string
        protected data: BasesQueryResult
        protected config: BasesViewConfig

        constructor(controller: QueryController)

        /**
         * Called when data changes - implement your render logic here
         */
        abstract onDataUpdated(): void

        /**
         * Create a new file for this view
         */
        createFileForView(
            name: string,
            frontmatterCallback?: (frontmatter: Record<string, unknown>) => void
        ): Promise<TFile>
    }

    /**
     * Plugin extension for Bases view registration
     */
    interface Plugin {
        registerBasesView(viewType: string, registration: BasesViewRegistration): boolean
    }
}
