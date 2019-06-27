"use strict";

class TabBar {

    static get DEFAULT_CONFIG() {
        return {
            id: null, // The id
            navigation: false, // set to true if this is a navigation element, so that it wraps in a <nav /> element.
            arialabel: 'Primary', // the aria label to use if this is a navigation
            vertical: false, // Vertical or horizontal
            animation: 'popin', // Set to null to disable animations
            tabs: [], // An array of tab definitions
            // {
            //    label: "Tab Text", // text, optional if given an icon
            //    id: null, // tab id, used with "activate(tabid)"
            //    icon: null, // an icon identifier, optional
            //    selected: false, // if true, start selected
            //    action: function(tab id, self) { } // what to do when the tab is clicked. if empty, uses default action.
            // }
            action: null, // a function, passed (tab id, self), where tab is the tab id, and self is this TabPanel.
                          // This is what will fire if there is no action defined on the tab definition.
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
            tab = this.list.find(`[data-tabid='${tab}']`);
        }
        if (!tab) {
            console.warn(`Tab does not exist: ${tab}`);
            return;
        }
        if (this.selected) {
            this.selected.removeAttr('aria-selected');
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
        let order = 0;

        for (let tabdef of this.tabs) {
            let $icon,
                $linktext;

            if ((!tabdef.label) && (!tabdef.icon)) {
                console.warn('TabBar: Element defined but has neither icon or text.  Skipping');
                break;
            }

            if (tabdef.icon) {
                $icon = IconFactory.icon(tabdef.icon);
            }
            if (tabdef.label) {
                $linktext = $('<span />').html(tabdef.label);
            }

            let $link = $('<a />')
                .attr('role', 'tab')
                .attr('aria-controls', `t-${tabdef.id}`)
                .attr('tabindex', -1)
                .attr('id', tabdef.id)
                .attr('data-tabid', tabdef.id)
                .append($icon)
                .append($linktext)
                .on('keydown', function(e) {
                    if ((e.keyCode === 37) || (e.keyCode === 38)) { // Left arrow || Up Arrow
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).parent().prev().children('a').focus();
                    } else if ((e.keyCode === 39) || (e.keyCode === 40)) { // Right arrow || Down Arrow
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).parent().next().children('a').focus();
                    } else if ((e.keyCode === 13) || (e.keyCode === 32)) { // return or space
                        $link.trigger('click');
                    }
                })
                .click(function(e) {
                    e.preventDefault();
                    me.select(tabdef.id);
                    if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                        tabdef.action(tabdef.id, me);
                    } else if (me.action) {
                        me.action(tabdef.id, me);
                    }
                });

            this.tabmap[tabdef.id] = $('<li />')
                .attr('role', 'presentation')
                .append($link);

            if (this.animation) {
                this.tabmap[tabdef.id]
                    .css('--anim-order', `${order++}`) // used in animations
                    .addClass(this.animation)
            }

            this.list.append(this.tabmap[tabdef.id]);

            if (this.navigation) {
                this.container = $('<nav />')
                    .attr('role', 'navigation')
                    .attr('aria-label', this.arialabel);
            } else {
                this.container = $('<div />');
            }

            this.container
                .addClass('tablist-container')
                .data('self', me)
                .addClass(this.classes.join(' '))
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

    get action() { return this.config.action; }
    set action(action) { this.config.action = action; }

    get animation() { return this.config.animation; }
    set animation(animation) { this.config.animation = animation; }

    get arialabel() { return this.config.arialabel; }
    set arialabel(arialabel) { this.config.arialabel = arialabel; }

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

    get navigation() { return this.config.navigation; }
    set navigation(navigation) { this.config.navigation = navigation; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get tabmap() { return this._tabmap; }
    set tabmap(tabmap) { this._tabmap = tabmap; }

    get tabs() { return this.config.tabs; }
    set tabs(tabs) { this.config.tabs = tabs; }

    get vertical() { return this.config.vertical; }
    set vertical(vertical) { this.config.vertical = vertical; }

}

