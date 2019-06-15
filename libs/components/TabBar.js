"use strict";

class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            vertical: false, // Vertical or horizontal
            tabs: [], // An array of tab definitions
            // {
            //    label: "Tab Text", // text
            //    id: null, // tab id, used with "activate(tabid)"
            //    selected: false, // if true, start selected
            //    action: function() { } // what to do when the tab is clicked.
            // }
            classes: [] //Extra css classes to apply
        }
    };

    /**
     * Define a TabBar
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TabBar.DEFAULT_CONFIG, config);
        this.tabmap = {};
        return this;
    }

    /* CORE METHODS_____________________________________________________________________ */

    /**
     * Marks a specific tab as selected
     * @param tab the tab to select
     */
    select(tab) {
        if (typeof tab === 'string') {
            tab = this.container.find(`[data-tabid='${tab}']`);
        }
        if (!tab) {
            console.warn(`Tab does not exist: ${tab}`);
            return;
        }
        if (this.selected) {
            this.selected.attr('aria-selected', false);
            this.selected.attr('tabindex', -1);
        }
        this.selected = tab.attr('aria-selected', true);
        this.selected.attr('tabindex', 0);

    }

    /* CONSTRUCTION METHODS_____________________________________________________________ */

    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    buildContainer() {
        const me = this;


        this.list = $('<ul />')
            .data('self', me)
            .attr('role', 'tablist')
            .addClass(this.classes.join(' '))
            .addClass('tabbar');

        if (this.vertical) {
            this.list.addClass('vertical');
        }

        for (let tabdef of this.tabs) {
            let $link = $('<a />')
                .attr('role', 'tab')
                .attr('aria-controls', `t-${tabdef.id}`)
                .attr('tabindex', -1)
                .attr('id', tabdef.id)
                .attr('data-tabid', tabdef.id)
                .html(tabdef.label)
                .click(function(e) {
                    e.preventDefault();
                    me.select(tabdef.id);
                    if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                        tabdef.action(e);
                    }
                });

            this.tabmap[tabdef.id] = $('<li />')
                .attr('role', 'presentation')
                .append($link);

            this.list.append(this.tabmap[tabdef.id]);

            this.container = $('<div />')
                .addClass('tablist-container')
                .append(this.list);


            if (tabdef.selected) { this.select(tabdef.id); }
        }
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () { return Utils.getConfig(this); }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() {
        if (!this._container) { this.buildContainer(); }
        return this._container;
    }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get list() { return this._list; }
    set list(list) { this._list = list; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}

