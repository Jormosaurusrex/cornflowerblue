"use strict";

class TabBar {

    static DEFAULT_CONFIG = {
        id : null, // The id
        tabdefs: [], // An array of tab definitions
        // {
        //    label: "Tab Text", // text
        //    selected: false, // if true, start selected
        //    action: function() { } // what to do when the tab is clicked.
        // }
        classes: [] //Extra css classes to apply
    };

    /**
     * Define a TabBar
     * @param config a dictionary object
     */
    constructor(config) {
        this.config = Object.assign({}, TabBar.DEFAULT_CONFIG, config);
        this.build();
        return this;
    }


    /**
     * Builds the DOM.
     * @returns {jQuery} jQuery representation
     */
    build() {
        const me = this;

        this.container = $('<ul />')
            .data('self', me)
            .addClass(this.classes.join(' '))
            .addClass('tabbar');

        for (let tabdef of this.tabdefs) {

            let $tab = $('<li />')
                .html(tabdef.label)
                .click(function(e) {
                    e.preventDefault();
                    me.select($tab);

                    if ((tabdef.action) && (typeof tabdef.action === 'function')) {
                        tabdef.action(e);
                    }
                });

            if (tabdef.selected) {
                this.select($tab);
            }

            this.container.append($tab);
        }

        if (!this.selected) {
            this.select(this.container.children()[0]);
        }

    }

    select(tab) {
        if (this.selected) { this.selected.removeClass('selected'); }
        this.selected = tab.addClass('selected');
    }

    /* UTILITY METHODS__________________________________________________________________ */

    /**
     * Dump this object as a string.
     * @returns {string}
     */
    toString () {
        return `TabBar | id: ${this.id}`;
    }

    /* ACCESSOR METHODS_________________________________________________________________ */

    get classes() { return this.config.classes; }
    set classes(classes) { this.config.classes = classes; }

    get container() { return this._container; }
    set container(container) { this._container = container; }

    get id() { return this.config.id; }
    set id(id) { this.config.id = id; }

    get selected() { return this._selected; }
    set selected(selected) { this._selected = selected; }

    get tabdefs() { return this.config.tabdefs; }
    set tabdefs(tabdefs) { this.config.tabdefs = tabdefs; }

}